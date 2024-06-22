import { AbstractEngine, Engine, WebGPUEngine } from "@babylonjs/core";
import { RefObject } from "react";

export declare namespace IBabylonCanvas {
  export interface Engines {
    webGLEngine?: Engine;
    webGPUEngine?: WebGPUEngine;
    engine: AbstractEngine;
  }

  export interface Props {
    canvasRef?: RefObject<HTMLCanvasElement>;
    onReady?: (engines: Engines) => void;
  }
}