import { AbstractEngine, AxesViewer, Engine, Scene, WebGPUEngine } from "@babylonjs/core";

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
    axesViewer?: AxesViewer;
  }

  export interface ApplyAxesViewer {
    enable: boolean;
    scaleSize: number;
    lineThicknessSize?: number;
  }

  export interface Props {
    isDisableWebGPU?: boolean;
    applyAxesViewer?: ApplyAxesViewer;
    onReady?: (initInfo: InitInfo) => void;
  }
}