
"use client"

import { useWebRtcManager } from "@wisdomstar94/react-web-rtc-manager";
import { useEffect } from "react";

type MetaData = {
  nickname: string;
};

export default function Page() {
  const webRtcManager = useWebRtcManager<MetaData>({
    defaultRtcConfiguration: {
      // ...
    },
    onCreatedPeerConnectionInfo(socketId, peerConnectionInfo) {
      console.log('@onCreatedPeerConnection', { socketId, peerConnectionInfo });  
    },
    onIceCandidate(socketId, event) {
      console.log('@onIceCandidate.event', event);
    },
    onIceCandidateError(socketId, event) {
      console.log('@onIceCandidateError.event', event);
    },
    onIceConnectionStateChange(socketId, event) {
      console.log('@onIceConnectionStateChange', event);
    },
    onIceGatheringStateChange(socketId, event) {
      console.log('@onIceGatheringStateChange', event);
    },
    onNegotiationNeeded(socketId, event) {
      console.log('@onNegotiationNeeded', event);
    },
    onSignalingStateChange(socketId, event) {
      console.log('@onSignalingStateChange', event);
    },
    onDataChannel(socketId, event) {
      console.log('@onDataChannel', event);
    },
    onConnectionStateChange(socketId, event) {
      console.log('@onConnectionStateChange', event);
    },
    onClosedPeerConnectionInfo(socketId, peerConnectionInfo) {
      console.log('@onClosedPeerConnectionInfo', { socketId, peerConnectionInfo });    
    },
  });

  useEffect(() => {
    webRtcManager.createPeerConnection({
      socketId: 1,
      meta: {
        nickname: 'zzz'
      },
    });
  }, []);

  return (
    <>
      
    </>
  );
}
