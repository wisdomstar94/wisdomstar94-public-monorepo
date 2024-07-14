import { useEffect, useRef, useState } from "react";
import { IUseWebRtcManager } from "./use-web-rtc-manager.interface";

export function useWebRtcManager<T = unknown>(props: IUseWebRtcManager.Props<T>) {
  const defaultRtcConfiguration = props.defaultRtcConfiguration;
  const dataChannelListeners = props.dataChannelListeners;
  const prevDataChannelListenersRef = useRef(dataChannelListeners);

  const onCreatedPeerConnectionInfo = props.onCreatedPeerConnectionInfo;
  const onClosedPeerConnectionInfo = props.onClosedPeerConnectionInfo;

  const onIceCandidateRef = useRef(props.onIceCandidate);
  onIceCandidateRef.current = props.onIceCandidate;

  const onIceCandidateErrorRef = useRef(props.onIceCandidateError);
  onIceCandidateErrorRef.current = props.onIceCandidateError;

  const onIceConnectionStateChangeRef = useRef(props.onIceConnectionStateChange);
  onIceConnectionStateChangeRef.current = props.onIceConnectionStateChange;

  const onIceGatheringStateChangeRef = useRef(props.onIceGatheringStateChange);
  onIceGatheringStateChangeRef.current = props.onIceGatheringStateChange;

  const onConnectionStateChangeRef = useRef(props.onConnectionStateChange);
  onConnectionStateChangeRef.current = props.onConnectionStateChange;

  const onDataChannelRef = useRef(props.onDataChannel);
  onDataChannelRef.current = props.onDataChannel;

  const onNegotiationNeededRef = useRef(props.onNegotiationNeeded);
  onNegotiationNeededRef.current = props.onNegotiationNeeded;

  const onSignalingStateChangeRef = useRef(props.onSignalingStateChange);
  onSignalingStateChangeRef.current = props.onSignalingStateChange;

  const [changedRtcPeerConnectionInfo, setChangedRtcPeerConnectionInfo] = useState<IUseWebRtcManager.ChangedRtcPeerConnectionInfo>();
  const [changedRtcPeerConnectionDataChannelMap, setChangedRtcPeerConnectionDataChannelMap] = useState<IUseWebRtcManager.ChangedRtcPeerConnectionInfo>();
  const rtcPeerConnectionInfoMapRef = useRef<Map<IUseWebRtcManager.PeerConnectionKey, IUseWebRtcManager.RTCPeerConnectionInfo<T>>>(new Map());
  const rtcPeerConnectionDataChannelMapRef = useRef<Map<`${IUseWebRtcManager.PeerConnectionKey}.${string}`, RTCDataChannel>>(new Map());

  function getPeerConnectionInfo(clientId: IUseWebRtcManager.ClientId, receiveId: IUseWebRtcManager.ReceiveId) {
    return rtcPeerConnectionInfoMapRef.current.get(`${clientId}.${receiveId}`) ?? rtcPeerConnectionInfoMapRef.current.get(`${receiveId}.${clientId}`);
  }

  function getPeerConnectionInfoMap() {
    return rtcPeerConnectionInfoMapRef.current;
  }

  function getPeerConnectionDataChannelMap() {
    return rtcPeerConnectionDataChannelMapRef.current;
  }

  function _onCreatedPeerConnectionInfo(peerConnectionInfo: IUseWebRtcManager.RTCPeerConnectionInfo<T>) {
    if (peerConnectionInfo.type === 'sendOffer') {
      for (const dataChannelListener of (dataChannelListeners ?? [])) {
        const dataChannel = peerConnectionInfo.rtcPeerConnection.createDataChannel(dataChannelListener.channelName);
        rtcPeerConnectionDataChannelMapRef.current.set(`${peerConnectionInfo.clientId}.${peerConnectionInfo.receiveId}.${dataChannelListener.channelName}`, dataChannel);
        setChangedRtcPeerConnectionDataChannelMap({ timestamp: Date.now() });
        // dataChannel.onopen = (event) => {
          
        // };  
        // dataChannel.onmessage = (event) => {
        //   dataChannelListener.callback(event);
        // };
      }
    }

    if (peerConnectionInfo.type === 'getOffer' && peerConnectionInfo.sdp !== undefined) {
      peerConnectionInfo.rtcPeerConnection.addEventListener('datachannel', (event) => {
        const channelName = event.channel.label;
        rtcPeerConnectionDataChannelMapRef.current.set(`${peerConnectionInfo.clientId}.${peerConnectionInfo.receiveId}.${channelName}`, event.channel);
        setChangedRtcPeerConnectionDataChannelMap({ timestamp: Date.now() });
        // const dataChannelListener = dataChannelListeners?.find(x => x.channelName === channelName);
        // event.channel.onopen = (event) => {
          
        // };
        // event.channel.onmessage = (event) => {
        //   dataChannelListener?.callback(event);
        // };
      });
    }
  }

  function _onIceCandidate(peerConnectionInfo: IUseWebRtcManager.RTCPeerConnectionInfo<T>, event: RTCPeerConnectionIceEvent) {
    if (event.candidate?.type !== undefined && event.candidate?.type !== null) {
      const count = peerConnectionInfo.candidateTypeCounting.get(event.candidate.type) ?? 0;
      peerConnectionInfo.candidateTypeCounting.set(event.candidate.type, count + 1);
      setChangedRtcPeerConnectionInfo({ timestamp: Date.now() });
    }
  }

  function _onConnectionStateChange(peerConnectionInfo: IUseWebRtcManager.RTCPeerConnectionInfo<T>, event: Event) {
    // const connectionState = peerConnectionInfo.rtcPeerConnection.connectionState; // "closed" | "connected" | "connecting" | "disconnected" | "failed" | "new";
    setChangedRtcPeerConnectionInfo({ timestamp: Date.now() });
  }
  
  function emitDataChannel(options: IUseWebRtcManager.DataChannelEmitOptions) {
    const {
      channelName,
      data,
    } = options;

    const arr = Array.from(rtcPeerConnectionDataChannelMapRef.current);
    for (const [key, channel] of arr) {
      if (key.includes('.' + channelName)) {
        if (channel.readyState === 'open') {
          channel.send(data);
        }
      }
    }
  }

  function createPeerConnection(options: IUseWebRtcManager.CreateConnectionOptionnOptionalRtcConfiguration<T>) {
    const {
      clientId,
      receiveId,
      meta,
      type,
      sdp,
    } = options;

    const targetPeerConnectionInfo = getPeerConnectionInfo(clientId, receiveId);
    if (targetPeerConnectionInfo !== undefined && targetPeerConnectionInfo.receiveId === receiveId) {
      console.warn(`이미 해당 peer connection 이 존재합니다.`, options.clientId);
      return;
    }

    const rtcConfiguration = options.rtcConfiguration ?? defaultRtcConfiguration;
    if (rtcConfiguration === undefined) {
      throw new Error(`defaultRtcConfiguration 을 명시하거나, rtcConfiguration 을 명시하세요.`);
    }

    const isApplyDefaultTurnServer = options.isApplyDefaultTurnServer ?? true;

    const defaultIceServers: RTCIceServer[] = [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun.l.google.com:5349" },
      { urls: "stun:stun1.l.google.com:3478" },
      { urls: "stun:stun1.l.google.com:5349" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:5349" },
      { urls: "stun:stun3.l.google.com:3478" },
      { urls: "stun:stun3.l.google.com:5349" },
      { urls: "stun:stun4.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:5349" }
    ];

    let applyIceServers: RTCIceServer[] | undefined = rtcConfiguration.iceServers;
    if (isApplyDefaultTurnServer) {
      applyIceServers = (applyIceServers ?? []).concat(defaultIceServers);
    }

    const configuration: RTCConfiguration = {
      ...rtcConfiguration,
      iceServers: applyIceServers,
    };

    const peerConnection = new RTCPeerConnection(configuration);

    const candidateTypeCounting: Map<RTCIceCandidateType, number> = new Map();
    candidateTypeCounting.set('host', 0);
    candidateTypeCounting.set('prflx', 0);
    candidateTypeCounting.set('relay', 0);
    candidateTypeCounting.set('srflx', 0);

    const peerConnectionInfo: IUseWebRtcManager.RTCPeerConnectionInfo<T> = {
      clientId,
      receiveId,
      type,
      sdp,
      rtcPeerConnection: peerConnection, 
      meta,
      candidateTypeCounting,
    };

    _onCreatedPeerConnectionInfo(peerConnectionInfo);

    peerConnection.onicecandidate = (event) => {
      _onIceCandidate(peerConnectionInfo, event);
      if (typeof onIceCandidateRef.current === 'function') {
        onIceCandidateRef.current(peerConnectionInfo, event);
      }
    };

    peerConnection.onicecandidateerror = (event) => {
      if (typeof onIceCandidateErrorRef.current === 'function') {
        onIceCandidateErrorRef.current(peerConnectionInfo, event);
      }
    };

    peerConnection.oniceconnectionstatechange = (event) => {
      if (typeof onIceConnectionStateChangeRef.current === 'function') {
        onIceConnectionStateChangeRef.current(peerConnectionInfo, event);
      }
    };

    peerConnection.onicegatheringstatechange = (event) => {
      if (typeof onIceGatheringStateChangeRef.current === 'function') {
        onIceGatheringStateChangeRef.current(peerConnectionInfo, event);
      }
    };

    peerConnection.onconnectionstatechange = (event) => {
      if (typeof onConnectionStateChangeRef.current === 'function') {
        onConnectionStateChangeRef.current(peerConnectionInfo, event);
      }
      _onConnectionStateChange(peerConnectionInfo, event);
    };

    peerConnection.ondatachannel = (event) => {
      if (typeof onDataChannelRef.current === 'function') {
        onDataChannelRef.current(peerConnectionInfo, event);
      }
    };

    peerConnection.onnegotiationneeded = (event) => {
      if (typeof onNegotiationNeededRef.current === 'function') {
        onNegotiationNeededRef.current(peerConnectionInfo, event);
      }
    };

    peerConnection.onsignalingstatechange = (event) => {
      if (typeof onSignalingStateChangeRef.current === 'function') {
        onSignalingStateChangeRef.current(peerConnectionInfo, event);
      }
    };

    if (typeof onCreatedPeerConnectionInfo === 'function') {
      onCreatedPeerConnectionInfo(peerConnectionInfo);
    }

    rtcPeerConnectionInfoMapRef.current.set(`${clientId}.${receiveId}`, peerConnectionInfo);
    setChangedRtcPeerConnectionInfo({ timestamp: Date.now() });
  }

  function closePeerConnection(clientId: IUseWebRtcManager.ClientId, receiveId: IUseWebRtcManager.ReceiveId) {
    const targetPeerConnectionInfo = getPeerConnectionInfo(clientId, receiveId);
    if (targetPeerConnectionInfo === undefined) {
      console.warn('이미 존재하지 않는 peerConnection 입니다.');
      return;
    }

    targetPeerConnectionInfo.rtcPeerConnection.close();
    rtcPeerConnectionInfoMapRef.current.delete(`${clientId}.${receiveId}`);
    rtcPeerConnectionInfoMapRef.current.delete(`${receiveId}.${clientId}`);
    for (const [key, value] of Array.from(new Map(rtcPeerConnectionDataChannelMapRef.current))) {
      if (key.startsWith(`${clientId}.${receiveId}`) || key.startsWith(`${receiveId}.${clientId}`)) {
        rtcPeerConnectionDataChannelMapRef.current.delete(key);
      }
    }
    setChangedRtcPeerConnectionInfo({ timestamp: Date.now() });
    setChangedRtcPeerConnectionDataChannelMap({ timestamp: Date.now() });
    if (typeof onClosedPeerConnectionInfo === 'function') {
      onClosedPeerConnectionInfo(targetPeerConnectionInfo);
    }
  }

  useEffect(() => {
    return () => {
      const map = getPeerConnectionInfoMap();
      for (const [clientId, peerConnectionInfo] of Array.from(map)) {
        peerConnectionInfo.rtcPeerConnection.close();
      }
    };
  }, []);

  useEffect(() => {
    dataChannelListeners?.forEach((item) => {
      const prevListener = prevDataChannelListenersRef.current?.find(x => x.channelName === item.channelName);

      const peersDataChannels = Array.from(rtcPeerConnectionDataChannelMapRef.current).filter(([key, value]) => {
        return key.endsWith('.' + item.channelName);
      });

      for (const [key, channel] of peersDataChannels) {
        if (prevListener !== undefined) {
          channel.removeEventListener('message', prevListener.callback);
        }
        channel.addEventListener('message', item.callback);
      }
    });

    prevDataChannelListenersRef.current = dataChannelListeners;
  }, [dataChannelListeners]);

  return {
    getPeerConnectionInfo,
    getPeerConnectionInfoMap,
    getPeerConnectionDataChannelMap,
    closePeerConnection,
    createPeerConnection,
    emitDataChannel,
    changedRtcPeerConnectionInfo,
    changedRtcPeerConnectionDataChannelMap,
  };
}