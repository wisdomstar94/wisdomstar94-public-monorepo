import { AbstractMesh, ISceneLoaderAsyncResult, PhysicsBody, Scene, TransformNode } from "@babylonjs/core";

export declare namespace IUseBabylonMeshPhysicsManager {
  // ------------------------------------------------------------
  export interface MeshFnParams {
    manageName: string;
  }

  export interface PhysicsBodyFnParams<T> {
    manageName: string;
    mesh: T;
  }

  export interface MeshPhysicBodyMapperInfo {
    manageName: string;
    mesh: AbstractMesh;
    physicsBody: PhysicsBody;
  }

  export interface InjectObjectOptions<T> {
    manageName: string;
    mesh: (params: MeshFnParams) => T;
    physicsBody: (mesh: PhysicsBodyFnParams<T>) => PhysicsBody;
  }

  // ------------------------------------------------------------
  export interface MeshFileFnParams {
    manageName: string;
    meshes: AbstractMesh[];
    loaderResult: ISceneLoaderAsyncResult;
  }

  export interface MeshFromFilePhysicBodyMapperInfo {
    loaderResult: ISceneLoaderAsyncResult;
    manageName: string;
    mesh: AbstractMesh;
    loadedMeshes: AbstractMesh[];
    physicsBody: PhysicsBody;
  }

  export interface InjectObjectFormFileOptions<T> {
    manageName: string;
    scene: Scene;
    fileUrlInfo: {
      baseUrl: string;
      fileName: string;
    };
    mesh: (params: MeshFileFnParams) => T;
    physicsBody: (mesh: PhysicsBodyFnParams<T>) => PhysicsBody;
  } 

  // ------------------------------------------------------------
  export interface Props {

  }
}