export declare namespace IUseWebRtcManager {
  export interface CreateConnectionOptions<T> {
    socketId: number;
    meta?: T;
    rtcConfiguration: RTCConfiguration;
    isApplyDefaultTurnServer?: boolean;
  }

  export type CreateConnectionOptionnOptionalRtcConfiguration<T> = Omit<CreateConnectionOptions<T>, 'rtcConfiguration'> & Partial<Pick<CreateConnectionOptions<T>, 'rtcConfiguration'>>;

  export interface RTCPeerConnectionInfo<T> {
    meta?: T;
    rtcPeerConnection: RTCPeerConnection;
  }

  export interface Props<T> {
    // autoStart?: boolean;
    onIceCandidate?: (socketId: number, event: RTCPeerConnectionIceEvent) => void;
    onIceCandidateError?: (socketId: number, event: RTCPeerConnectionIceErrorEvent) => void;
    onIceConnectionStateChange?: (socketId: number, event: Event) => void;
    onIceGatheringStateChange?: (socketId: number, event: Event) => void;
    onConnectionStateChange?: (socketId: number, event: Event) => void;
    onDataChannel?: (socketId: number, event: RTCDataChannelEvent) => void;
    onNegotiationNeeded?: (socketId: number, event: Event) => void;
    onSignalingStateChange?: (socketId: number, event: Event) => void;
    defaultRtcConfiguration?: RTCConfiguration;
    onCreatedPeerConnectionInfo?: (socketId: number, peerConnectionInfo: RTCPeerConnectionInfo<T>) => void;
    onClosedPeerConnectionInfo?: (socketId: number, peerConnectionInfo: RTCPeerConnectionInfo<T>) => void;
  }
}