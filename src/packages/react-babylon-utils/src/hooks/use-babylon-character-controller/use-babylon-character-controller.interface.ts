import { ArcRotateCamera, Scene } from "@babylonjs/core";

export declare namespace IUseBabylonCharacterController {
  export type CharacterGoDirection = 
    'Up' | 
    'Down' | 
    'Left' | 
    'Right' | 
    'Up+Left' | 
    'Up+Right' | 
    'Down+Left' |
    'Down+Right'
  ;

  export interface GlbFileUrl {
    baseUrl: string;
    filename: string;
  }

  export interface Vector3 {
    x: number;
    y: number;
    z: number;
  }

  export interface InitRequireInfo {
    camera: ArcRotateCamera;
    scene: Scene;
    glbFileUrl: GlbFileUrl;
    characterSize: Vector3;
    characterInitPosition: Vector3;
  }

  export interface DebugOptions {
    isShowCharacterParentBoxMesh?: boolean;
  }

  export interface Props {
    debugOptions?: DebugOptions;
  }
}