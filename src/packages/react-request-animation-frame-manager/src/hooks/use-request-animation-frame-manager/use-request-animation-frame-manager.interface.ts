export declare namespace IUseRequestAnimationFrameManager {
  export interface Props {
    isAutoStart?: boolean;
    callback: (startedTimestamp: number, currentTimestamp: number, step: number) => void;
  }
}