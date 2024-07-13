import { useEffect, useRef } from "react";
import { IUseWebRtcManager } from "./use-web-rtc-manager.interface";

export function useWebRtcManager<T = unknown>(props: IUseWebRtcManager.Props<T>) {
  const defaultRtcConfiguration = props.defaultRtcConfiguration;

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

  const rtcPeerConnectionInfoMapRef = useRef<Map<IUseWebRtcManager.PeerConnectionKey, IUseWebRtcManager.RTCPeerConnectionInfo<T>>>(new Map());

  function getPeerConnectionInfo(clientId: IUseWebRtcManager.ClientId, receiveId: IUseWebRtcManager.ReceiveId) {
    return rtcPeerConnectionInfoMapRef.current.get(`${clientId}.${receiveId}`) ?? rtcPeerConnectionInfoMapRef.current.get(`${receiveId}.${clientId}`);
  }

  function getPeerConnectionInfoMap() {
    return rtcPeerConnectionInfoMapRef.current;
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

    // console.log('@configuration', configuration);

    const peerConnection = new RTCPeerConnection(configuration);

    const peerConnectionInfo: IUseWebRtcManager.RTCPeerConnectionInfo<T> = {
      clientId,
      receiveId,
      type,
      sdp,
      rtcPeerConnection: peerConnection, 
      meta,
    };

    peerConnection.onicecandidate = (event) => {
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
  }

  function closePeerConnection(clientId: IUseWebRtcManager.ClientId, receiveId: IUseWebRtcManager.ReceiveId) {
    const targetPeerConnectionInfo = getPeerConnectionInfo(clientId, receiveId);
    if (targetPeerConnectionInfo === undefined) {
      console.warn('이미 존재하지 않는 peerConnection 입니다.');
      return;
    }

    targetPeerConnectionInfo.rtcPeerConnection.close();
    rtcPeerConnectionInfoMapRef.current.delete(`${clientId}.${receiveId}`);
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

  return {
    getPeerConnectionInfo,
    getPeerConnectionInfoMap,
    closePeerConnection,
    createPeerConnection,
  };
}