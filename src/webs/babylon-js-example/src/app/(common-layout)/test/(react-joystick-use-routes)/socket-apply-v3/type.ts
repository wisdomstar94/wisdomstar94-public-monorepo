import { IUseBabylonCharacterController } from "@wisdomstar94/react-babylon-utils";

export interface OpponentConnectInfoRtcData {
  event: 'opponentConnectInfo';
  data: IUseBabylonCharacterController.AddRequireInfoWithoutScene;
}

export interface RequestConnectInfoRtcData {
  event: 'requestConnectInfo';
  data?: null;
}

export type RtcData = 
OpponentConnectInfoRtcData |
  RequestConnectInfoRtcData
;
