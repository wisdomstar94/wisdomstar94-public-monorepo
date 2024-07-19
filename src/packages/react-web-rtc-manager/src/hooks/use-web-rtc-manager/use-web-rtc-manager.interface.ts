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
    candidateTypeCounting: Map<RTCIceCandidateType, number>;
  }

  export interface ChangedRtcPeerConnectionInfo {
    timestamp: number;
  }

  export interface DataChannelListener<T> {
    channelName: string;
    callback: (peerConnectionInfo: RTCPeerConnectionInfo<T>, event: MessageEvent<any>) => void;
    opened?: (peerConnectionInfo: RTCPeerConnectionInfo<T>, event: Event) => void;
    receivedChannel?: (peerConnectionInfo: RTCPeerConnectionInfo<T>, event: RTCDataChannelEvent) => void;
  }

  export interface RTCDataChannelInfo<T> {
    peerConnectionInfo: RTCPeerConnectionInfo<T>;
    channel: RTCDataChannel;
  }

  export interface DataChannelEmitOptions<M, T> {
    channelName: string;
    rtcPeerConnections?: RTCPeerConnectionInfo<T>[];
    data?: string | M;
    prevent?: (prevData?: string | M | undefined) => boolean;
  }

  export interface Props<T> {
    // autoStart?: boolean;
    dataChannelListeners?: DataChannelListener<T>[];
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