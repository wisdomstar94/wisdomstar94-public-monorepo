import { AbstractMesh, AnimationGroup, ArcRotateCamera, ISceneLoaderAsyncResult, Mesh, PhysicsBody, Scene } from "@babylonjs/core";

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

  export interface AnimationGroupNames {
    idleAnimationGroupName?: string;
    walkingAnimationGroupName?: string;
    runningAnimationGroupName?: string;
    jumpingAnimationGroupName?: string;
  }

  export interface OnLoadedInfo {
    characterLoaderResult: ISceneLoaderAsyncResult;
    characterMeshes: AbstractMesh[];
    characterAnimationGroups: Map<string, AnimationGroup>;
    characterBox: Mesh;
    characterBoxPhysicsBody: PhysicsBody;
  }

  export interface Props {
    animationGroupNames?: AnimationGroupNames;
    debugOptions?: DebugOptions;
    onLoaded?: (info: OnLoadedInfo) => void;
  }
}