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

export type RtcData = 
  OpponentConnectInfoRtcData |
  RequestConnectInfoRtcData | 
  OpponentCurrentPositionAndRotationRtcData | 
  OpponentMovingRtcData | 
  OpponentJumpingRtcData
;