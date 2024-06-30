import { PhysicsBody, TransformNode } from "@babylonjs/core";

export declare namespace IUseBabylonMeshPhysicsManager {
  export interface MeshFnParams {
    manageName: string;
  }

  export interface PhysicsBodyFnParams<T> {
    manageName: string;
    mesh: T;
  }

  export interface MeshPhysicBodyMapperInfo {
    manageName: string;
    mesh: TransformNode;
    physicsBody: PhysicsBody;
  }

  export interface InjectObjectOptions<T> {
    manageName: string;
    mesh: (params: MeshFnParams) => T;
    physicsBody: (mesh: PhysicsBodyFnParams<T>) => PhysicsBody;
  }

  export interface Props {

  }
}