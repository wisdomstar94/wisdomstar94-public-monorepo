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

  export interface VectorThree {
    x: number;
    y: number;
    z: number;
  }

  export interface VectorFour {
    x: number;
    y: number;
    z: number;
    w: number;
  }

  export interface ChracterPhysicsBodyOptions {
    angularDamping?: number;
    linearDamping?: number;
  }

  export interface AddRequireInfo {
    camera?: ArcRotateCamera;
    characterId: string;
    scene: Scene;
    glbFileUrl: GlbFileUrl;
    characterSize: VectorThree;
    characterInitPosition: VectorThree;
    characterJumpingDelay: number;
    characterJumpingDuration: number;
    characterAnimationGroupNames: AnimationGroupNames;
    chracterPhysicsBodyOptions?: ChracterPhysicsBodyOptions;
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

  export interface CharacterItem {
    characterId: string;
    camera?: ArcRotateCamera;
    scene: Scene;
    characterLoaderResult: ISceneLoaderAsyncResult;
    characterMeshes: AbstractMesh[];
    characterAnimationGroups: Map<string, AnimationGroup>;
    characterAnimationGroupNames: AnimationGroupNames;
    characterBox: Mesh;
    characterBoxPhysicsBody: PhysicsBody;
    characterSize: VectorThree;
    glbFileUrl: GlbFileUrl;
    cameraDirection?: VectorThree;
    direction: IUseBabylonCharacterController.CharacterGoDirection | undefined;
    jumpingDelay: number;
    jumpingDuration: number;
    isJumping: boolean;
    isRunning: boolean;
    jumpingInterval: NodeJS.Timeout | undefined;
    addRequireInfo: AddRequireInfo;
  }

  export interface CharacterMovingOptions {
    characterId: string;
    direction: IUseBabylonCharacterController.CharacterGoDirection | undefined; 
    cameraDirection?: VectorThree;
    isRunning?: boolean;
  }
  
  export interface CharacterPositionAndRotationOptions {
    characterId: string;
    position: IUseBabylonCharacterController.VectorThree;
    rotation?: IUseBabylonCharacterController.VectorFour;
    // cameraDirection?: IUseBabylonCharacterController.VectorThree;
  }

  export interface ThisClientCharacterOptions {
    characterId: string;
    nearDistance: number;
  }

  export interface Props {
    debugOptions?: DebugOptions;
    onAdded?: (characterItem: CharacterItem) => void;
    thisClientCharacterOptions?: ThisClientCharacterOptions;
  }
}