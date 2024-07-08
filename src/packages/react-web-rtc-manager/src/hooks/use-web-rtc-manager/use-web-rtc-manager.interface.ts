export declare namespace IUseWebRtcManager {
  export interface CreateConnectionOptions {
    rtcConfiguration: RTCConfiguration;
    isApplyDefaultTurnServer?: boolean;
  }

  export interface Props {
    autoStart?: boolean;
    onIceCandidate?: (event: RTCPeerConnectionIceEvent) => void;
    onIceCandidateError?: (event: RTCPeerConnectionIceErrorEvent) => void;
    onIceConnectionStateChange?: (event: Event) => void;
    onIceGatheringStateChange?: (event: Event) => void;
    onConnectionStateChange?: (event: Event) => void;
    onDataChannel?: (event: RTCDataChannelEvent) => void;
    onNegotiationNeeded?: (event: Event) => void;
    onSignalingStateChange?: (event: Event) => void;
    defaultCreateConnectionOptions?: CreateConnectionOptions;
  }
}