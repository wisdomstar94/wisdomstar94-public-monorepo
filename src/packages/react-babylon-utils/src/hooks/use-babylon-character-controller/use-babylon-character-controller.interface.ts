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

  export type GroupName = string;

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

  export interface CharacterJumpingOptions {
    jumpingAnimationStartDelay: number;
    jumpingAnimationDuration: number;
    jumpingTotalDuration: number;
  }

  export interface AddRequireInfo {
    camera?: ArcRotateCamera;
    characterId: string;
    characterNickName?: string;
    characterVisibilityDelay?: number;
    scene: Scene;
    glbFileUrl: GlbFileUrl;
    characterSize: VectorThree;
    characterInitPosition: VectorThree;
    characterInitRotation?: VectorFour;
    characterJumpingOptions: CharacterJumpingOptions;
    characterAnimationGroupNames: AnimationGroupNames;
    chracterPhysicsBodyOptions?: ChracterPhysicsBodyOptions;
  }

  export type AddRequireInfoWithoutScene = Omit<AddRequireInfo, 'scene'>;

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

  export interface AddInCharacterParamsBabylonLogicReturnParams {
    meshes: AbstractMesh[];
    others?: any[];
  }

  export interface AddInCharacterParams {
    groupName: GroupName;
    babylonLogic: () => Promise<AddInCharacterParamsBabylonLogicReturnParams>;
    isOriginalDeleteWhenDuplicated?: boolean;
    isAutoDeleteTimeout?: number;
  }

  export interface AddedGroupInfo {
    groupName: GroupName;
    autoDeleteTimeouter?: NodeJS.Timeout;
    babylonLogicResult: AddInCharacterParamsBabylonLogicReturnParams;
  }

  export interface SnapshotDumpings {
    linearDamping: number;
    angularDamping: number;
  }

  export interface CharacterItem {
    characterId: string;
    characterNickName?: string;
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
    jumpingOptions: CharacterJumpingOptions;
    saveJumpingOptions: CharacterJumpingOptions;
    isJumping: boolean;
    isJumpPossible?: boolean;
    isRunning: boolean;
    jumpingInterval: NodeJS.Timeout | undefined;
    addRequireInfo: AddRequireInfo;
    add: (params: AddInCharacterParams) => Promise<any>;
    addedGroups: Map<GroupName, AddedGroupInfo>;
    snapshotDumpings: SnapshotDumpings;
  }

  export interface CharacterMovingOptions {
    characterId: string;
    direction: IUseBabylonCharacterController.CharacterGoDirection | undefined; 
    cameraDirection?: VectorThree;
    isRunning?: boolean;
  }

  export interface CharacterPositionAndRotationOptionsNotApplyPositionOptions {
    /** 적용하고자 하는 position 과 캐릭터의 현재 position 에 큰 차이가 없는 경우 적용하지 않을 것인지에 대한 여부 (기본값: false) */
    isNotApplyPositionWhenNotBigDiffrence?: boolean;
    /** 얼마까지를 큰 차이라고 볼 것인가에 대한 값 (기본 값: 2) */
    bigDifferenceDistance?: number;
  }

  export interface CharacterPositionAndRotationOptionsAnimateOptions {
    /** 기본값: false */
    isAnimate?: boolean;
    /** 기본값: 300 (ms) */
    duration: number;
  }
  
  export interface CharacterPositionAndRotationOptions {
    characterId: string;
    position: IUseBabylonCharacterController.VectorThree;
    rotation?: IUseBabylonCharacterController.VectorFour;
    // notApplyPositionWhenNotBigDiffrenceOptions?: CharacterPositionAndRotationOptionsNotApplyPositionOptions;
    // animateOptions?: CharacterPositionAndRotationOptionsAnimateOptions;
  }

  export interface ThisClientCharacterOptions {
    characterId: string;
    nearDistance: number;
  }

  export interface Props {
    debugOptions?: DebugOptions;
    onAdded?: (characterItem: CharacterItem, scene: Scene) => void;
    thisClientCharacterOptions?: ThisClientCharacterOptions;
  }
}