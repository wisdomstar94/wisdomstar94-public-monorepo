export declare namespace IUseWebRtcManager {
  export type ClientId = string;
  export type ReceiveId = string;

  export type PeerConnectionKey = `${ClientId}.${ReceiveId}` | `${ReceiveId}.${ClientId}`;

  export type CreateConnectionType = 'sendOffer' | 'getOffer';

  export interface CreateConnectionOptions<T> {
    clientId: string;
    receiveId: string;
    type: CreateConnectionType;
    sdp?: RTCSessionDescriptionInit;
    meta?: T;
    rtcConfiguration: RTCConfiguration;
    isApplyDefaultTurnServer?: boolean;
  }

  export type CreateConnectionOptionnOptionalRtcConfiguration<T> = Omit<CreateConnectionOptions<T>, 'rtcConfiguration'> & Partial<Pick<CreateConnectionOptions<T>, 'rtcConfiguration'>>;

  export interface RTCPeerConnectionInfo<T> {
    clientId: string;
    receiveId: string;
    sdp?: RTCSessionDescriptionInit;
    type: CreateConnectionType;
    meta?: T;
    rtcPeerConnection: RTCPeerConnection;
  }

  export interface Props<T> {
    // autoStart?: boolean;
    onIceCandidate?: (peerConnectionInfo: RTCPeerConnectionInfo<T>, event: RTCPeerConnectionIceEvent) => void;
    onIceCandidateError?: (peerConnectionInfo: RTCPeerConnectionInfo<T>, event: RTCPeerConnectionIceErrorEvent) => void;
    onIceConnectionStateChange?: (peerConnectionInfo: RTCPeerConnectionInfo<T>, event: Event) => void;
    onIceGatheringStateChange?: (peerConnectionInfo: RTCPeerConnectionInfo<T>, event: Event) => void;
    onConnectionStateChange?: (peerConnectionInfo: RTCPeerConnectionInfo<T>, event: Event) => void;
    onDataChannel?: (peerConnectionInfo: RTCPeerConnectionInfo<T>, event: RTCDataChannelEvent) => void;
    onNegotiationNeeded?: (peerConnectionInfo: RTCPeerConnectionInfo<T>, event: Event) => void;
    onSignalingStateChange?: (peerConnectionInfo: RTCPeerConnectionInfo<T>, event: Event) => void;
    defaultRtcConfiguration?: RTCConfiguration;
    onCreatedPeerConnectionInfo?: (peerConnectionInfo: RTCPeerConnectionInfo<T>) => void;
    onClosedPeerConnectionInfo?: (peerConnectionInfo: RTCPeerConnectionInfo<T>) => void;
  }
}