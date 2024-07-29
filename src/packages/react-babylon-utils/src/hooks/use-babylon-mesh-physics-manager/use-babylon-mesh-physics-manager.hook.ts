import { useEffect, useRef, useState } from "react";
import { IUseBabylonMeshPhysicsManager } from "./use-babylon-mesh-physics-manager.interface";
import { AbstractMesh, AnimationGroup, AnimationPropertiesOverride, PhysicsBody, SceneLoader, TransformNode } from "@babylonjs/core";

export function useBabylonMeshPhysicsManager() {
  const [inited, setInited] = useState(false);
  const meshPhysicsBodyMapperRef = useRef<Map<string, IUseBabylonMeshPhysicsManager.MeshPhysicBodyMapperInfo>>(new Map());
  const meshFromFilePhysicsBodyMapperRef = useRef<Map<string, IUseBabylonMeshPhysicsManager.MeshFromFilePhysicBodyMapperInfo>>(new Map());

  function injectObject<T extends AbstractMesh>(options: IUseBabylonMeshPhysicsManager.InjectObjectOptions<T>) {
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

  function injectObjectFromFile<T extends AbstractMesh>(options: IUseBabylonMeshPhysicsManager.InjectObjectFormFileOptions<T>) {
    const {
      manageName,
      scene,
      fileUrlInfo,
      mesh,
      physicsBody,
    } = options;

    const result = SceneLoader.ImportMeshAsync(undefined, fileUrlInfo.baseUrl, fileUrlInfo.fileName, scene).then((result) => {
      const loaderResult = result;
      const meshes = loaderResult.meshes;

      // animation group 간에 부드럽게 전환되는 효과를 위해서는 아래와 같이 작성해주어야 함.
      // if (scene.animationPropertiesOverride === null) {
      //   scene.animationPropertiesOverride = new AnimationPropertiesOverride();
      //   scene.animationPropertiesOverride.enableBlending = true;
      //   scene.animationPropertiesOverride.blendingSpeed = 0.05;
      // }
  
      const m = mesh({ manageName, meshes, loaderResult });
      const p = physicsBody({ manageName, mesh: m });

      meshFromFilePhysicsBodyMapperRef.current.set(manageName, {
        loaderResult,
        manageName,
        mesh: m,
        loadedMeshes: meshes,
        physicsBody: p,
      });
    });
  }

  function getObject(manageName: string) {
    return meshPhysicsBodyMapperRef.current.get(manageName);
  }

  function getObjectMesh<T extends AbstractMesh>(manageName: string): T | undefined {
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

  function getAllFromFileObjectsMap() {
    return meshFromFilePhysicsBodyMapperRef.current;
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

      getAllFromFileObjectsMap().forEach((value, key) => {
        value.mesh.dispose();
        value.loadedMeshes.forEach(m => {
          if (!m.isDisposed()) m.dispose();
        });
        value.physicsBody.dispose();
      });
    };
  }, [inited]);

  return {
    injectObject,
    injectObjectFromFile,
    getObject,
    getObjectMesh,
    getObjectPhysicsBody,
    getAllObjectsMap,
    getAllFromFileObjectsMap,
  };
}