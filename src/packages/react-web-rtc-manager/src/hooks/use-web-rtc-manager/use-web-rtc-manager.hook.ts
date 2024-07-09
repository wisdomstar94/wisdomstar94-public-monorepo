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

  const rtcPeerConnectionInfoMapRef = useRef<Map<number, IUseWebRtcManager.RTCPeerConnectionInfo<T>>>(new Map());

  function getPeerConnectionInfo(socketId: number) {
    return rtcPeerConnectionInfoMapRef.current.get(socketId);
  }

  function getPeerConnectionInfoMap() {
    return rtcPeerConnectionInfoMapRef.current;
  }

  function createPeerConnection(options: IUseWebRtcManager.CreateConnectionOptionnOptionalRtcConfiguration<T>) {
    const {
      socketId,
      meta,
    } = options;

    const targetPeerConnectionInfo = getPeerConnectionInfo(socketId);
    if (targetPeerConnectionInfo !== undefined) {
      console.warn(`이미 해당 peer connection 이 존재합니다.`, options.socketId);
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

    peerConnection.onicecandidate = (event) => {
      if (typeof onIceCandidateRef.current === 'function') {
        onIceCandidateRef.current(socketId, event);
      }
    };

    peerConnection.onicecandidateerror = (event) => {
      if (typeof onIceCandidateErrorRef.current === 'function') {
        onIceCandidateErrorRef.current(socketId, event);
      }
    };

    peerConnection.oniceconnectionstatechange = (event) => {
      if (typeof onIceConnectionStateChangeRef.current === 'function') {
        onIceConnectionStateChangeRef.current(socketId, event);
      }
    };

    peerConnection.onicegatheringstatechange = (event) => {
      if (typeof onIceGatheringStateChangeRef.current === 'function') {
        onIceGatheringStateChangeRef.current(socketId, event);
      }
    };

    peerConnection.onconnectionstatechange = (event) => {
      if (typeof onConnectionStateChangeRef.current === 'function') {
        onConnectionStateChangeRef.current(socketId, event);
      }
    };

    peerConnection.ondatachannel = (event) => {
      if (typeof onDataChannelRef.current === 'function') {
        onDataChannelRef.current(socketId, event);
      }
    };

    peerConnection.onnegotiationneeded = (event) => {
      if (typeof onNegotiationNeededRef.current === 'function') {
        onNegotiationNeededRef.current(socketId, event);
      }
    };

    peerConnection.onsignalingstatechange = (event) => {
      if (typeof onSignalingStateChangeRef.current === 'function') {
        onSignalingStateChangeRef.current(socketId, event);
      }
    };

    const peerConnectionInfo: IUseWebRtcManager.RTCPeerConnectionInfo<T> = {
      rtcPeerConnection: peerConnection, 
      meta,
    };

    if (typeof onCreatedPeerConnectionInfo === 'function') {
      onCreatedPeerConnectionInfo(socketId, peerConnectionInfo);
    }

    rtcPeerConnectionInfoMapRef.current.set(socketId, peerConnectionInfo);
  }

  function closePeerConnection(socketId: number) {
    const targetPeerConnectionInfo = getPeerConnectionInfo(socketId);
    if (targetPeerConnectionInfo === undefined) {
      console.warn('이미 존재하지 않는 peerConnection 입니다.');
      return;
    }

    targetPeerConnectionInfo.rtcPeerConnection.close();
    rtcPeerConnectionInfoMapRef.current.delete(socketId);
    if (typeof onClosedPeerConnectionInfo === 'function') {
      onClosedPeerConnectionInfo(socketId, targetPeerConnectionInfo);
    }
  }

  useEffect(() => {
    return () => {
      const map = getPeerConnectionInfoMap();
      for (const [socketId, peerConnectionInfo] of Array.from(map)) {
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