
"use client"

import { useWebRtcManager } from "@wisdomstar94/react-web-rtc-manager";
import { useEffect } from "react";

export default function Page() {
  const webRtcManager = useWebRtcManager({
    autoStart: true,
    defaultCreateConnectionOptions: {
      rtcConfiguration: {
        
      },
    },
    onIceCandidate(event) {
      console.log('@onIceCandidate.event', event);
    },
    onIceCandidateError(event) {
      console.log('@onIceCandidateError.event', event);
    },
    onIceConnectionStateChange(event) {
      console.log('@onIceConnectionStateChange', event);
    },
    onIceGatheringStateChange(event) {
      console.log('@onIceGatheringStateChange', event);
    },
    onNegotiationNeeded(event) {
      console.log('@onNegotiationNeeded', event);
    },
    onSignalingStateChange(event) {
      console.log('@onSignalingStateChange', event);
    },
    onDataChannel(event) {
      console.log('@onDataChannel', event);
    },
    onConnectionStateChange(event) {
      console.log('@onConnectionStateChange', event);
    },
  });

  useEffect(() => {
    if (!webRtcManager.isRtcPeerConnectionCreated) return;

    const rtcPeerConnection = webRtcManager.rtcPeerConnection;
    if (rtcPeerConnection === undefined) return;

    rtcPeerConnection.createOffer().then((res) => {
      console.log('@createOffer.res', res);
      return rtcPeerConnection.setLocalDescription(new RTCSessionDescription(res));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webRtcManager.isRtcPeerConnectionCreated]);

  return (
    <>
      isRtcPeerConnectionCreated: { webRtcManager.isRtcPeerConnectionCreated ? 'true' : 'false' }
    </>
  );
}
