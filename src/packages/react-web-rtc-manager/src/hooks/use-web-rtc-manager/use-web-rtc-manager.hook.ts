import { useEffect, useRef, useState } from "react";
import { IUseWebRtcManager } from "./use-web-rtc-manager.interface";

export function useWebRtcManager(props: IUseWebRtcManager.Props) {
  const autoStart = props.autoStart ?? false;
  const defaultCreateConnectionOptions = props.defaultCreateConnectionOptions;

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

  const rtcPeerConnectionRef = useRef<RTCPeerConnection>();

  const [isRtcPeerConnectionCreated, setIsRtcPeerConnectionCreated] = useState(false);

  function createConnection(options: IUseWebRtcManager.CreateConnectionOptions) {
    if (rtcPeerConnectionRef.current !== undefined) {
      throw new Error(`이미 RTCPeerConnection 이 생성되었습니다.`);
    }

    const {
      rtcConfiguration,
    } = options;

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

    let applyIceServers: RTCIceServer[] | undefined = options.rtcConfiguration.iceServers;
    if (isApplyDefaultTurnServer) {
      applyIceServers = (applyIceServers ?? []).concat(defaultIceServers);
    }

    const configuration: RTCConfiguration = {
      ...rtcConfiguration,
      iceServers: applyIceServers,
    };

    // console.log('@configuration', configuration);

    rtcPeerConnectionRef.current = new RTCPeerConnection(configuration);
    setIsRtcPeerConnectionCreated(true);

    rtcPeerConnectionRef.current.onicecandidate = (event) => {
      if (typeof onIceCandidateRef.current === 'function') {
        onIceCandidateRef.current(event);
      }
    };

    rtcPeerConnectionRef.current.onicecandidateerror = (event) => {
      if (typeof onIceCandidateErrorRef.current === 'function') {
        onIceCandidateErrorRef.current(event);
      }
    };

    rtcPeerConnectionRef.current.oniceconnectionstatechange = (event) => {
      if (typeof onIceConnectionStateChangeRef.current === 'function') {
        onIceConnectionStateChangeRef.current(event);
      }
    };

    rtcPeerConnectionRef.current.onicegatheringstatechange = (event) => {
      if (typeof onIceGatheringStateChangeRef.current === 'function') {
        onIceGatheringStateChangeRef.current(event);
      }
    };

    rtcPeerConnectionRef.current.onconnectionstatechange = (event) => {
      if (typeof onConnectionStateChangeRef.current === 'function') {
        onConnectionStateChangeRef.current(event);
      }
    };

    rtcPeerConnectionRef.current.ondatachannel = (event) => {
      if (typeof onDataChannelRef.current === 'function') {
        onDataChannelRef.current(event);
      }
    };

    rtcPeerConnectionRef.current.onnegotiationneeded = (event) => {
      if (typeof onNegotiationNeededRef.current === 'function') {
        onNegotiationNeededRef.current(event);
      }
    };

    rtcPeerConnectionRef.current.onsignalingstatechange = (event) => {
      if (typeof onSignalingStateChangeRef.current === 'function') {
        onSignalingStateChangeRef.current(event);
      }
    };
  }

  function closeConnection() {
    rtcPeerConnectionRef.current?.close();
    rtcPeerConnectionRef.current = undefined;
    setIsRtcPeerConnectionCreated(false);
  }

  useEffect(() => {
    if (autoStart) {
      if (defaultCreateConnectionOptions === undefined) throw new Error(`autoStart 가 true 일 경우에는, hook props 중에 defaultCreateConnectionOptions 값이 필수입니다.`);
      createConnection(defaultCreateConnectionOptions);
    } else {
      closeConnection();
    }

    return () => {
      closeConnection();
    };
  }, [autoStart]);

  return {
    isRtcPeerConnectionCreated,
    createConnection,
    closeConnection,
    rtcPeerConnection: rtcPeerConnectionRef.current,
  };
}