import { AbstractEngine, Engine, Scene, WebGPUEngine } from "@babylonjs/core";

export declare namespace IBabylonCanvas {
  export interface Engines {
    webGLEngine?: Engine;
    webGPUEngine?: WebGPUEngine;
    engine: AbstractEngine;
  }

  export interface InitInfo {
    engines: Engines;
    scene: Scene;
    canvas: HTMLCanvasElement;
  }

  export interface Props {
    onReady?: (initInfo: InitInfo) => void;
  }
}