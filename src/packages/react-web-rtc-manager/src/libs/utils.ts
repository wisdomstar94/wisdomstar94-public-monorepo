import { IUseWebRtcManager } from "@/hooks/use-web-rtc-manager/use-web-rtc-manager.interface";

export function isEqualClientIdAndReceiveIdSumKey<T>(rtcPeerConnection1: IUseWebRtcManager.RTCPeerConnectionInfo<T>, rtcPeerConnection2: IUseWebRtcManager.RTCPeerConnectionInfo<T>) {
  const rtcPeerConnection1Keys = [rtcPeerConnection1.clientId + '.' + rtcPeerConnection1.receiveId, rtcPeerConnection1.receiveId + '.' + rtcPeerConnection1.clientId] as const;
  const rtcPeerConnection2Keys = [rtcPeerConnection2.clientId + '.' + rtcPeerConnection2.receiveId, rtcPeerConnection2.receiveId + '.' + rtcPeerConnection2.clientId] as const;
  return rtcPeerConnection2Keys.includes(rtcPeerConnection1Keys[0]) || rtcPeerConnection2Keys.includes(rtcPeerConnection1Keys[1]);
}