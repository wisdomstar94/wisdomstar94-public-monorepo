
"use client"

import { useSocketioManager } from "@wisdomstar94/react-socketio-manager";
import { useWebRtcManager } from "@wisdomstar94/react-web-rtc-manager";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

type MetaData = {
  nickname: string;
};

export default function Page() {
  // test variables start
  const [inputedDataChannelName, setInputedDataChannelName] = useState('chat');
  const [inputedData, setInputedData] = useState('hi hi');
  const [getDatas, setGetDatas] = useState<Array<{ data: string; createdAt: Date }>>([]);
  const [clientId, setClientId] = useState('');
  // test variables end

  useEffect(() => {
    setClientId(v4());
  }, []);

  const socketioManager = useSocketioManager({
    isAutoConnect: true,
    listeners: [
      {
        eventName: 'allUsers',
        callback(clientIds: string[]) {
          console.log('@allUsers', clientIds);
          console.log('@clientId', clientId);
          for (const id of clientIds) {
            if (id === clientId) continue;

            webRtcManager.createPeerConnection({
              clientId: clientId,
              receiveId: id,
              type: 'sendOffer',
              meta: {
                nickname: 'zzz'
              },
            });
          }
        },
      },
      {
        eventName: 'oneUser',
        callback(data: { clientId: string, isExist: boolean }) {
          console.log('@oneUser', data.clientId);
          if (data.isExist) {
            webRtcManager.createPeerConnection({
              clientId: clientId,
              receiveId: data.clientId,
              type: 'sendOffer',
              meta: {
                nickname: 'zzz'
              },
            });
          }
        },
      },
      {
        eventName: 'getOffer',
        callback(data: { sdp: RTCSessionDescriptionInit, clientId: string, receiveId: string }) {
          console.log('getOffer!', data);

          webRtcManager.createPeerConnection({
            clientId: data.receiveId,
            receiveId: data.clientId,
            type: 'getOffer',
            sdp: data.sdp,
            meta: {
              nickname: 'zzz'
            },
          });
        },
      },
      {
        eventName: 'getAnswer',
        callback(data: { sdp: RTCSessionDescriptionInit, clientId: string, receiveId: string }) {
          console.log('getAnswer!', data);

          const peerConnectionInfo = webRtcManager.getPeerConnectionInfo(data.clientId, data.receiveId);
          if (peerConnectionInfo === undefined) {
            throw new Error(`peerConnectionInfo is undefined.`);
          }
          peerConnectionInfo.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
        },
      },
      {
        eventName: 'getCandidate',
        callback(data: { candidate: RTCIceCandidate, clientId: string, receiveId: string }) {
          const peerConnectionInfo = webRtcManager.getPeerConnectionInfo(data.clientId, data.receiveId);
          if (peerConnectionInfo === undefined) {
            throw new Error(`peerConnectionInfo is undefined.`);
          }
          peerConnectionInfo.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(data.candidate)).then(() => {
            console.log('candidate add success');
          });
        },
      },
      {
        eventName: 'getPeerDisconnected',
        callback(data: { clientId: string, receiveId: string }) {
          console.log('@getPeerDisconnected', data);
          webRtcManager.closePeerConnection(data.clientId, data.receiveId);
          // socketioManager.emit({ eventName: 'sendSyncPeerDisconnected', data: { clientId: data.receiveId, receiveId: data.clientId } });
          webRtcManager.createPeerConnection({
            clientId: clientId,
            receiveId: data.clientId,
            type: 'sendOffer',
            meta: {
              nickname: 'zzz'
            },
          });
        },
      },
      // {
      //   eventName: 'getSyncPeerDisconnected',
      //   callback(data: { clientId: string, receiveId: string }) {
      //     console.log('@getSyncPeerDisconnected', data);
      //     webRtcManager.createPeerConnection({
      //       clientId: clientId,
      //       receiveId: data.clientId,
      //       type: 'sendOffer',
      //       meta: {
      //         nickname: 'zzz'
      //       },
      //     });
      //   },
      // },
    ],
    socketUrl: process.env.NEXT_PUBLIC_WEBS_BABYLON_JS_EXAMPLE_SOCKET_CONNECT_URL ?? (() => { throw new Error(`NEXT_PUBLIC_WEBS_BABYLON_JS_EXAMPLE_SOCKET_CONNECT_URL is not defined!`) })()
  });

  const webRtcManager = useWebRtcManager<MetaData>({
    defaultRtcConfiguration: {
      // ...
      iceServers: [
        {
          urls: process.env.NEXT_PUBLIC_ICE_SERVER_URL ?? (() => { throw new Error(`NEXT_PUBLIC_ICE_SERVER_URL is not defined!`) })(),
          username: process.env.NEXT_PUBLIC_ICE_SERVER_USERNAME ?? (() => { throw new Error(`NEXT_PUBLIC_ICE_SERVER_USERNAME is not defined!`) })(),
          credential: process.env.NEXT_PUBLIC_ICE_SERVER_CREDENTIAL ?? (() => { throw new Error(`NEXT_PUBLIC_ICE_SERVER_CREDENTIAL is not defined!`) })(),
        }
      ]
    },
    dataChannelListeners: [
      {
        channelName: 'chat',
        callback(event) {
          console.log('@[chat] channel event get!', event);
          setGetDatas(prev => prev.concat({ data: event.data, createdAt: new Date() }));
        }, 
      }
    ],
    onCreatedPeerConnectionInfo(peerConnectionInfo) {
      const {
        clientId,
        receiveId,
        rtcPeerConnection,
        meta,
      } = peerConnectionInfo;

      console.log('@onCreatedPeerConnection', peerConnectionInfo);  
      if (peerConnectionInfo.type === 'sendOffer') {
        // const dataChannel = peerConnectionInfo.rtcPeerConnection.createDataChannel("chat");
        // dataChannel.onmessage = (event) => {
        //   console.log('@dataChannel.onmessage', event);
        //   dataChannel.send('zzzzzzz');
        // };

        rtcPeerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then((sdp) => {
          console.log('create offer success');
          rtcPeerConnection.setLocalDescription(new RTCSessionDescription(sdp));
          socketioManager.emit({
            eventName: 'sendOffer',
            data: {
              sdp,
              clientId,
              receiveId,
            },
          });
        });
      } 

      if (peerConnectionInfo.type === 'getOffer' && peerConnectionInfo.sdp !== undefined) {
        // rtcPeerConnection.addEventListener('datachannel', (event) => {
        //   console.log('@@@ datachannel', event);
        //   event.channel.send('hi');
        //   event.channel.onmessage = (e) => {
        //     console.log('---  e', e);
        //   };
        // });
        peerConnectionInfo.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(peerConnectionInfo.sdp)).then(() => {
          console.log('answer set remote description success');
          peerConnectionInfo.rtcPeerConnection.createAnswer({ offerToReceiveVideo: true, offerToReceiveAudio: true })
            .then(sdp => { 
              console.log('create answer success');
              peerConnectionInfo.rtcPeerConnection.setLocalDescription(new RTCSessionDescription(sdp));
              socketioManager.emit({
                eventName: 'sendAnswer',
                data: {
                  sdp,
                  clientId: peerConnectionInfo.clientId,
                  receiveId: peerConnectionInfo.receiveId,
                },
              });
            })
            .catch(error => {
                console.log(error);
            });
        });
      }
    },
    onIceCandidate(peerConnectionInfo, event) {
      console.log('@onIceCandidate.event', { peerConnectionInfo, event });
      if (event.candidate) {
        let receiveId = peerConnectionInfo.clientId !== clientId ? peerConnectionInfo.clientId : peerConnectionInfo.receiveId;

        socketioManager.emit({
          eventName: 'sendCandidate',
          data: {
            candidate: event.candidate,
            clientId: clientId,
            receiveId,
          },
        });
      } 
    },
    onIceCandidateError(peerConnectionInfo, event) {
      // console.log('@onIceCandidateError.event', event);
    },
    onIceConnectionStateChange(peerConnectionInfo, event) {
      console.log('@onIceConnectionStateChange', event);
    },
    onIceGatheringStateChange(peerConnectionInfo, event) {
      console.log('@onIceGatheringStateChange', event);
    },
    onNegotiationNeeded(peerConnectionInfo, event) {
      console.log('@onNegotiationNeeded', event);
    },
    onSignalingStateChange(peerConnectionInfo, event) {
      console.log('@onSignalingStateChange', event);
      
    },
    onDataChannel(peerConnectionInfo, event) {
      console.log('@onDataChannel', event);
    },
    onConnectionStateChange(peerConnectionInfo, event) {
      console.log('@onConnectionStateChange', { peerConnectionInfo,  event });

      switch(peerConnectionInfo.rtcPeerConnection.connectionState) {
        case 'connected': break;
        case 'disconnected': 
          webRtcManager.closePeerConnection(peerConnectionInfo.clientId, peerConnectionInfo.receiveId);
          if (peerConnectionInfo.type === 'sendOffer') {
            socketioManager.emit({ eventName: 'sendPeerDisconnected', data: { clientId: peerConnectionInfo.clientId, receiveId: peerConnectionInfo.receiveId } })
            // socketioManager.emit({ eventName: 'requestOneUser', data: { targetClientId: peerConnectionInfo.receiveId } })
          }
          break;
      }
    },
    onClosedPeerConnectionInfo(peerConnectionInfo) {
      console.log('@onClosedPeerConnectionInfo', peerConnectionInfo);    
    },
  });

  useEffect(() => {
    if (socketioManager.isConnected === true && clientId !== '') {
      socketioManager.emit({ eventName: 'requestAllUsers', data: { clientId } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketioManager.isConnected, clientId]);

  return (
    <>
      <div className="w-full flex flex-wrap gap-2 relative">
        <table className="w-full relative text-xs border-t border-l border-slate-400">
          <tbody>
            <tr>
              <th className="border-r border-b border-slate-400 text-left bg-slate-200">
                현재 내 clientId
              </th>
              <td className="border-r border-b border-slate-400 p-1">
                <div className="px-1 py-0.5 bg-blue-100 border border-slate-600">
                  { clientId }
                </div>
              </td>
            </tr>
            <tr>
              <th className="border-r border-b border-slate-400 text-left bg-slate-200">
                나를 제외한 현재 연결되어 있는 client ids
              </th>
              <td className="border-r border-b border-slate-400">
                <ul className="w-full relative flex flex-wrap gap-2">
                  {
                    Array.from(webRtcManager.getPeerConnectionInfoMap()).map(([key, info]) => {
                      const [clientId, receiveId] = key.split('.');
                      return (
                        <li key={key} className="w-full flex flex-wrap p-1">
                          <div className="px-1 py-0.5 bg-blue-100 relative w-full flex flex-wrap gap-1 border border-slate-600">
                            <div className="inline-flex px-2 py-0.5 bg-orange-300 rounded-lg gap-2">
                              {
                                Array.from(info.candidateTypeCounting).map(([candidateType, count]) => {
                                  return (
                                    <div key={candidateType + count}>
                                      { candidateType }: { count }
                                    </div>
                                  )
                                })
                              }
                            </div>
                            <div className="w-full">
                              { clientId }
                            </div>
                            <div className="w-full h-[1px] bg-black"></div>
                            <div className="w-full">
                              { receiveId }
                            </div>
                          </div>
                        </li>
                      );
                    })
                  }
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="w-full flex flex-wrap gap-2 relative text-xs items-end">
          <div className="inline-flex flex-col">
            <label>
              data channel name
            </label>
            <input type="text" className="border border-slate-500" value={inputedDataChannelName} onChange={e => setInputedDataChannelName(e.target.value)} />
          </div>
          <div className="inline-flex flex-col">
            <label>
              data 
            </label>
            <input type="text" className="border border-slate-500" value={inputedData} onChange={e => setInputedData(e.target.value)} />
          </div>
          <div className="inline-flex flex-col">
            {/* <label>
              &nbsp; 
            </label> */}
            <button
              className="bg-blue-200 rounded-md cursor-pointer hover:bg-blue-300 px-2 py-1"
              onClick={() => {
                webRtcManager.emitDataChannel({
                  channelName: inputedDataChannelName,
                  data: inputedData,
                })
              }}
              >
              이벤트 보내기
            </button>
          </div>
        </div>
        <div className="w-full flex flex-wrap gap-2 relative">
          {
            Array.from(webRtcManager.getPeerConnectionDataChannelMap()).map(([key, value]) => {
              return (
                <div key={key} className="w-full border border-red-400 px-2 py-1 text-xs">
                  key : { key }, channel : { value.label }
                </div>
              );
            })
          }
        </div>
        <div className="w-full flex flex-wrap gap-2 relative">
          {
            getDatas.map((item) => {
              return (
                <div key={item.data + item.createdAt.getTime()} className="w-full border border-yellow-500 px-2 py-1 text-xs">
                  createdAt: { item.createdAt.toLocaleString() } / data: { item.data }
                </div>
              );
            })
          }
        </div>
      </div>
    </>
  );
}
