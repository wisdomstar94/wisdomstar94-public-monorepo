import { IUseBabylonCharacterController } from "@wisdomstar94/react-babylon-utils";

export type OpponentConnectInfoRtcData = {
  event: 'opponentConnectInfo';
  data: IUseBabylonCharacterController.AddRequireInfoWithoutScene;
}

export type RequestConnectInfoRtcData = {
  event: 'requestConnectInfo';
  data?: null;
}

export type OpponentCurrentPositionAndRotationRtcData = {
  event: 'opponentCurrentPositionAndRotation';
  data: IUseBabylonCharacterController.CharacterPositionAndRotationOptions;
}

export type RequestCurrentPositionAndRotationRtcData = {
  event: 'requestConnectPositionAndRotation';
  data?: null;
}

export type OpponentMovingRtcData = {
  event: 'opponentMoving';
  data: IUseBabylonCharacterController.CharacterMovingOptions;
}

export type OpponentJumpingRtcData = {
  event: 'opponentJumping';
  data: {
    characterId: string;
    jumpingOptions: IUseBabylonCharacterController.CharacterJumpingOptions;
  };
}

export type ChatInfoRtcData = {
  event: 'chatInfo';
  data: ChatData;
}

export type RtcData = 
  OpponentConnectInfoRtcData |
  RequestConnectInfoRtcData | 
  OpponentCurrentPositionAndRotationRtcData | 
  RequestCurrentPositionAndRotationRtcData |
  OpponentMovingRtcData | 
  OpponentJumpingRtcData | 
  ChatInfoRtcData
;

export type ChatData = {
  writer: string;
  writerId: string;
  writedAt: number;
  content: string;
}