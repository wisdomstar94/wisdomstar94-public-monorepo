import { RefObject } from "react";

export declare namespace IBabylonCanvas {
  export interface Props {
    canvasRef?: RefObject<HTMLCanvasElement>;
    onReady?: () => void;
  }
}