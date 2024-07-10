
"use client"

import { useSocketioManager } from "@wisdomstar94/react-socketio-manager";
import { useWebRtcManager } from "@wisdomstar94/react-web-rtc-manager";
import { useEffect } from "react";

type MetaData = {
  nickname: string;
};

export default function Page() {
  const socketioManager = useSocketioManager({
    isAutoConnect: true,
    listeners: [
      {
        eventName: 'allUsers',
        callback(clientIds: string[]) {
          console.log('@allUsers', clientIds);
          for (const clientId of clientIds) {
            if (clientId === socketioManager.getSocketId()) continue;

            webRtcManager.createPeerConnection({
              clientId: socketioManager.getSocketId(),
              receiveId: clientId,
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

          const peerConnectionInfo = webRtcManager.getPeerConnectionInfo(data.receiveId);
          if (peerConnectionInfo === undefined) {
            throw new Error(`peerConnectionInfo is undefined.`);
          }
          peerConnectionInfo.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
        },
      },
      {
        eventName: 'getCandidate',
        callback(data: { candidate: RTCIceCandidate, clientId: string, receiveId: string }) {
          const peerConnectionInfo = webRtcManager.getPeerConnectionInfo(data.receiveId);
          if (peerConnectionInfo === undefined) {
            throw new Error(`peerConnectionInfo is undefined.`);
          }
          peerConnectionInfo.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(data.candidate)).then(() => {
            console.log('candidate add success');
          });
        },
      }
    ],
    socketUrl: process.env.NEXT_PUBLIC_WEBS_BABYLON_JS_EXAMPLE_SOCKET_CONNECT_URL ?? (() => { throw new Error(`NEXT_PUBLIC_WEBS_BABYLON_JS_EXAMPLE_SOCKET_CONNECT_URL is not defined!`) })()
  });

  const webRtcManager = useWebRtcManager<MetaData>({
    defaultRtcConfiguration: {
      // ...
    },
    onCreatedPeerConnectionInfo(peerConnectionInfo) {
      const {
        clientId,
        receiveId,
        rtcPeerConnection,
        meta,
      } = peerConnectionInfo;

      console.log('@onCreatedPeerConnection', peerConnectionInfo);  
      if (peerConnectionInfo.type === 'sendOffer') {
        const dataChannel = peerConnectionInfo.rtcPeerConnection.createDataChannel("chat");
        dataChannel.onmessage = (event) => {
          console.log('@dataChannel.onmessage', event);
          dataChannel.send('zzzzzzz');
        };

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
        rtcPeerConnection.addEventListener('datachannel', (event) => {
          console.log('@@@ datachannel', event);
          event.channel.send('hi');
          event.channel.onmessage = (e) => {
            console.log('---  e', e);
          };
        });
        peerConnectionInfo.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(peerConnectionInfo.sdp)).then(() => {
          console.log('answer set remote description success');
          peerConnectionInfo.rtcPeerConnection.createAnswer()
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
      if (peerConnectionInfo.type === 'sendOffer' && event.candidate) {
        // const dataChannel = peerConnectionInfo.rtcPeerConnection.createDataChannel("chat");
        
        // setTimeout(() => {
        //   dataChannel.send('hi 용 ㅋ');
        // }, 3000);

        socketioManager.emit({
          eventName: 'sendCandidate',
          data: {
            candidate: event.candidate,
            clientId: peerConnectionInfo.clientId,
            receiveId: peerConnectionInfo.receiveId,
          },
        });
      } else {
        // const dataChannel = peerConnectionInfo.rtcPeerConnection.createDataChannel("chat");
        // dataChannel.onmessage = (event) => {
        //   console.log('@event.data', event.data);
        // };
      }
      // if (peerConnectionInfo.clientId === socketioManager.getSocketId()) return;
      // if (event.candidate === null) return;
      // console.log('!!!');
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
    },
    onClosedPeerConnectionInfo(peerConnectionInfo) {
      console.log('@onClosedPeerConnectionInfo', peerConnectionInfo);    
    },
  });

  // useEffect(() => {
  //   if (!socketioManager.isConnected) return;

  //   webRtcManager.createPeerConnection({
  //     clientId: socketioManager.getSocketId(),
  //     meta: {
  //       nickname: 'zzz'
  //     },
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [socketioManager.isConnected]);

  return (
    <>
      
    </>
  );
}
