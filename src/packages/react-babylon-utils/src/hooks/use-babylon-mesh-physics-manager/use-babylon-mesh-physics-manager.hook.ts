import { useEffect, useRef, useState } from "react";
import { IUseBabylonMeshPhysicsManager } from "./use-babylon-mesh-physics-manager.interface";
import { PhysicsBody, TransformNode } from "@babylonjs/core";

export function useBabylonMeshPhysicsManager() {
  const [inited, setInited] = useState(false);
  const meshPhysicsBodyMapperRef = useRef<Map<string, IUseBabylonMeshPhysicsManager.MeshPhysicBodyMapperInfo>>(new Map());

  function injectObject<T extends TransformNode>(options: IUseBabylonMeshPhysicsManager.InjectObjectOptions<T>) {
    const {
      manageName,
      mesh,
      physicsBody,
    } = options;

    const m = mesh({ manageName });
    const p = physicsBody({ manageName, mesh: m });

    meshPhysicsBodyMapperRef.current.set(manageName, {
      manageName,
      mesh: m,
      physicsBody: p,
    });
  }

  function getObject(manageName: string) {
    return meshPhysicsBodyMapperRef.current.get(manageName);
  }

  function getObjectMesh<T extends TransformNode>(manageName: string): T | undefined {
    const target = getObject(manageName);
    if (target === undefined) return undefined;
    return target.mesh as T;
  }

  function getObjectPhysicsBody(manageName: string): PhysicsBody | undefined {
    const target = getObject(manageName);
    if (target === undefined) return undefined;
    return target.physicsBody;
  }

  function getAllObjectsMap() {
    return meshPhysicsBodyMapperRef.current;
  }

  useEffect(() => {
    setInited(true);
  }, []);

  useEffect(() => {
    if (inited !== true) return;

    return () => {
      getAllObjectsMap().forEach((value, key) => {
        value.mesh.dispose();
        value.physicsBody.dispose();
      });
    };
  }, [inited]);

  return {
    injectObject,
    getObject,
    getObjectMesh,
    getObjectPhysicsBody,
    getAllObjectsMap,
  };
}