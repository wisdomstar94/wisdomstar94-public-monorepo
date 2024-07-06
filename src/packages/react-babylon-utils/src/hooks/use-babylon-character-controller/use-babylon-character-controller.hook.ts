import { useRef, useState } from "react";
import { IUseBabylonCharacterController } from "./use-babylon-character-controller.interface";
import { AnimationGroup, AnimationPropertiesOverride, MeshBuilder, PhysicsBody, PhysicsMotionType, PhysicsShapeCylinder, Quaternion, Ray, SceneLoader, Vector3 } from "@babylonjs/core";
import { useRequestAnimationFrameManager } from "@wisdomstar94/react-request-animation-frame-manager";

export function useBabylonCharacterController(props: IUseBabylonCharacterController.Props) {
  const {
    debugOptions,
    onAdded,
    thisClientCharacterId,
  } = props;

  const firstQuaternionWithCameraRef = useRef<Quaternion>();
  const thisClientCharacterIdRef = useRef(thisClientCharacterId ?? '');
  const charactersRef = useRef<Map<string, IUseBabylonCharacterController.CharacterItem>>(new Map());
  const [isThisClientCharacterControlling, setIsThisClientCharacterControlling] = useState(false);
  const [isThisClientCharacterLoaded, setIsThisClientCharacterLoaded] = useState(false);

  function setThisClientCharacterId(characterId: string) {
    thisClientCharacterIdRef.current = characterId;
  }

  function add(params: IUseBabylonCharacterController.AddRequireInfo) {
    const {
      camera,
      characterId,
      scene,
      glbFileUrl,
      characterSize,
      characterInitPosition,
      characterJumpingDelay,
      characterJumpingDuration,
      characterAnimationGroupNames,
      chracterPhysicsBodyOptions,
    } = params;

    const angularDamping = chracterPhysicsBodyOptions?.angularDamping ?? 100;
    const linearDamping = chracterPhysicsBodyOptions?.linearDamping ?? 10;

    const t = charactersRef.current.get(characterId);
    if (t !== undefined) {
      console.warn('이미 해당 캐릭터는 존재합니다.');
      return;
    }

    // 캐릭터와 맵핑할 메쉬

    // 캐릭터와 맵핑할 메쉬 :: 눈에 보여지는 부분
    const characterBox = MeshBuilder.CreateCylinder("box", { 
      height: characterSize.y, 
      diameter: characterSize.x,
    }, scene);
    characterBox.position.x = characterInitPosition.x;
    characterBox.position.y = characterInitPosition.y;
    characterBox.position.z = characterInitPosition.z;
    characterBox.rotationQuaternion = Quaternion.Identity();
    // characterBox.setPivotMatrix(Matrix.Translation(0, characterSize.y / 2, 0), false);
    // characterBox.translate(Axis.Y, characterSize.y);
    // characterBox.setPivotMatrix(Matrix.Translation(0, characterSize.y / 2, 0), false);
    // characterBox.setPivotPoint(new Vector3(0, -characterSize.y / 2, 0));
    
    characterBox.visibility = debugOptions?.isShowCharacterParentBoxMesh === true ? 1 : 0;

    // 캐릭터와 맵핑할 메쉬 :: 눈에 안보이는 물리적 세계에 존재하는 부분
    const characterBoxPhysicsBody = new PhysicsBody(
      characterBox, 
      PhysicsMotionType.DYNAMIC, 
      false, 
      scene,
    );
    characterBoxPhysicsBody.shape = new PhysicsShapeCylinder(
      new Vector3(0, 0, 0),
      new Vector3(0, characterSize.y, 0),
      characterSize.x,
      scene,
    );
    characterBoxPhysicsBody.setMassProperties({ 
      mass: 1, 
      inertia: new Vector3(0, 0, 0), 
    });
    characterBoxPhysicsBody.setAngularDamping(angularDamping);
    characterBoxPhysicsBody.setLinearDamping(linearDamping);

    // 카메라 설정
    if (camera !== undefined) {
      camera.alpha = Math.PI / 2;
      camera.beta = -Math.PI;
      camera.radius = 30;
      camera.position.x = characterBox.position.x;
      camera.position.y = characterBox.position.y + 5;
      camera.position.z = characterBox.position.z - 9;
      camera.setTarget(characterBox);
    }

    // model import!!!
    SceneLoader.ImportMeshAsync(undefined, glbFileUrl.baseUrl, glbFileUrl.filename, scene).then((result) => {
      // console.log('@result', result);
      const characterLoaderResult = result;
      const characterMeshes = characterLoaderResult.meshes;
      const characterAnimationGroups = new Map<string, AnimationGroup>();

      // animation group 간에 부드럽게 전환되는 효과를 위해서는 아래와 같이 작성해주어야 함.
      if (scene.animationPropertiesOverride === null) {
        scene.animationPropertiesOverride = new AnimationPropertiesOverride();
        scene.animationPropertiesOverride.enableBlending = true;
        scene.animationPropertiesOverride.blendingSpeed = 0.05;
      }

      // 초기 캐릭터가 바라보는 방향 셋팅을 위한 로직
      let quaternion: Quaternion | undefined = undefined;
      if (camera !== undefined) {
        const { direction } = camera.getForwardRay();
        const forward = new Vector3(direction.normalize().x, 0, direction.normalize().z);
        const rot = Quaternion.FromLookDirectionLH(forward, Vector3.Up());
        const euler = rot.toEulerAngles();
        quaternion = euler.toQuaternion();
        firstQuaternionWithCameraRef.current = quaternion;
      }

      characterMeshes.forEach(mesh => {
        if (characterBox !== undefined) {
          mesh.parent = characterBox;
        }
        mesh.scaling.scaleInPlace(0.01);
        if (quaternion !== undefined) {
          mesh.rotationQuaternion = quaternion;
        } else if (firstQuaternionWithCameraRef.current !== undefined) {
          mesh.rotationQuaternion = firstQuaternionWithCameraRef.current.clone();
        } else {
          mesh.rotationQuaternion = Quaternion.Identity();
        }
      });

      characterLoaderResult.animationGroups.forEach(anim => {
        characterAnimationGroups.set(anim.name, anim);
      });

      const characterItem: IUseBabylonCharacterController.CharacterItem = {
        characterId,
        camera,
        scene,
        characterLoaderResult,
        characterMeshes,
        characterAnimationGroups,
        characterAnimationGroupNames,
        characterBox,
        characterBoxPhysicsBody,
        characterSize,
        glbFileUrl,
        direction: undefined,
        jumpingDelay: characterJumpingDelay,
        jumpingDuration: characterJumpingDuration,
        isJumping: false,
        isRunning: false,
        jumpingInterval: undefined,
        addRequireInfo: params,
      };
      charactersRef.current.set(characterId, characterItem);
      if (typeof onAdded === 'function') {
        onAdded(characterItem);
      }

      console.log('@thisClientCharacterIdRef.current', thisClientCharacterIdRef.current);
      console.log('@characterId', characterId);
      if (thisClientCharacterIdRef.current === characterId) {
        setIsThisClientCharacterLoaded(true);
      }
    }).catch((error) => {
      console.error('에러 발생', error);
    });
  }

  function remove(characterId: string) {
    const target = charactersRef.current.get(characterId);
    if (target === undefined) return;

    target.characterBox.dispose();
    target.characterBoxPhysicsBody.dispose();
    target.characterMeshes.forEach(x => x.dispose());
    target.characterAnimationGroups.forEach(k => k.dispose());
    target.characterLoaderResult.geometries.forEach(k => k.dispose());
    target.characterLoaderResult.skeletons.forEach(k => k.dispose());
    target.characterLoaderResult.transformNodes.forEach(k => k.dispose());
    target.characterLoaderResult.animationGroups.forEach(k => k.dispose());
    charactersRef.current.delete(characterId);
  }

  function setCharacterPositionAndRotation(options: IUseBabylonCharacterController.CharacterPositionAndRotationOptions) {
    const {
      characterId,
      position,
      rotation,
      // cameraDirection,
    } = options;
    const targetCharacter = charactersRef.current.get(characterId);
    if (targetCharacter === undefined) {
      console.error('해당 id 로 등록된 캐릭터가 없습니다.');
      return;
    }

    // targetCharacter.characterBoxPhysicsBody.setLinearDamping(1000);
    // const ori = targetCharacter.characterBoxPhysicsBody.getLinearVelocity();
    // targetCharacter.characterBoxPhysicsBody.setLinearVelocity(new Vector3(0, 0, 0));
    targetCharacter.characterBoxPhysicsBody.setTargetTransform(new Vector3(position.x, position.y, position.z), Quaternion.Identity());
    // targetCharacter.characterBoxPhysicsBody.setLinearDamping(20);
    // targetCharacter.characterBoxPhysicsBody.setLinearDamping(10);
    // if (rotation !== undefined && cameraDirection !== undefined) {
      
    // }
    if (rotation !== undefined) {
      targetCharacter.characterMeshes.forEach((mesh) => {
        // mesh.rotationQuaternion = Quaternion.FromEulerVector(new Vector3(rotation.x, rotation.y, rotation.z));
        if (mesh.rotationQuaternion !== null) {
          let newQ = mesh.rotationQuaternion.clone();
          newQ.x = rotation.x;
          newQ.y = rotation.y;
          newQ.z = rotation.z;
          newQ.w = rotation.w;
          mesh.rotationQuaternion = newQ;
          // Quaternion.SlerpToRef(
          //   mesh.rotationQuaternion,
          //   newQ,
          //   0.4,
          //   mesh.rotationQuaternion
          // );
        }
      });  
    }
  }

  function setCharacterMoving(options: IUseBabylonCharacterController.CharacterMovingOptions) {
    const { 
      characterId,
      direction,
      cameraDirection,
      isRunning,
    } = options;

    const targetCharacter = charactersRef.current.get(characterId);
    if (targetCharacter === undefined) {
      console.error('해당 id 로 등록된 캐릭터가 없습니다.');
      return;
    }

    targetCharacter.cameraDirection = cameraDirection;
    targetCharacter.direction = direction;
    targetCharacter.isRunning = isRunning ?? false;
  }

  function setCharacterJumping(characterId: string, delay?: number, duration?: number) {
    const targetCharacter = charactersRef.current.get(characterId);
    if (targetCharacter === undefined) {
      console.error('해당 id 로 등록된 캐릭터가 없습니다.');
      return;
    }

    if (targetCharacter.isJumping) return;
    targetCharacter.isJumping = true;
    if (delay !== undefined) {
      targetCharacter.jumpingDelay = delay;
    }
    if (duration !== undefined) {
      targetCharacter.jumpingDuration = duration;
    }
  }

  function getCharactersMap() {
    return charactersRef.current;
  }

  function getCharacter(characterId: string) {
    return charactersRef.current.get(characterId);
  }

  function setIsThisClientCharacterControllingWrapper(v: boolean, characterId: string) {
    if (characterId !== thisClientCharacterId) return;
    setIsThisClientCharacterControlling(prev => v);
  }

  useRequestAnimationFrameManager({
    isAutoStart: true,
    callback(startedTimestamp, currentTimestamp, step) {
      charactersRef.current.forEach((characterItem, characterId) => {
        let cameraDirection: Vector3 | undefined = undefined;
        if (characterItem.camera !== undefined) {
          cameraDirection = characterItem.camera.getForwardRay().direction;  
        } else {
          if (characterItem.cameraDirection !== undefined) {
            const { x, y, z } = characterItem.cameraDirection;
            cameraDirection = new Vector3(x, y, z);
          }
        }

        // console.log(`[${characterId}] cameraDirection`, cameraDirection);
        // const { direction } = camera.getForwardRay();
        
        // const forward = camera.getDirection(new Vector3(0, 0, 1)).normalize();
        const forward = new Vector3(cameraDirection?.normalize().x, 0, cameraDirection?.normalize().z);
        const rot = Quaternion.FromLookDirectionLH(forward, Vector3.Up());
        const euler = rot.toEulerAngles();
        // const euler = box.rotationQuaternion!.toEulerAngles();
        let keydown = false;
        let moveDirection = new Vector3(0, 0, 0);
        let isEulerChanged = false;

        const angle180 = Math.PI;
        const angle45 = angle180 / 4;
        const angle90 = angle180 / 2;
        const angle135 = angle45 + angle90;

        const walkingAnim = characterItem.characterAnimationGroups.get(characterItem.characterAnimationGroupNames?.walkingAnimationGroupName ?? '');
        const idleAnim = characterItem.characterAnimationGroups.get(characterItem.characterAnimationGroupNames?.idleAnimationGroupName ?? '');
        const jumpAnim = characterItem.characterAnimationGroups.get(characterItem.characterAnimationGroupNames?.jumpingAnimationGroupName ?? '');
        const runningAnim = characterItem.characterAnimationGroups.get(characterItem.characterAnimationGroupNames?.runningAnimationGroupName ?? '');

        // ⬆
        if (characterItem.direction === 'Up') {
          keydown = true;
          isEulerChanged = true;
          euler.y = euler.y + angle180;
          moveDirection = forward;
        }
        // ⬇
        if (characterItem.direction === 'Down') {
          keydown = true;
          isEulerChanged = true;
          euler.y = euler.y;
          moveDirection = forward.negate();
        }
        // ⬅
        if (characterItem.direction === 'Left') {
          keydown = true;
          isEulerChanged = true;
          euler.y = euler.y + angle90;
          moveDirection = Vector3.Cross(forward, Vector3.Up()).normalize();
        }
        // ⮕
        if (characterItem.direction === 'Right') {
          keydown = true;
          isEulerChanged = true;
          euler.y = euler.y - angle90;
          moveDirection = Vector3.Cross(Vector3.Up(), forward).normalize();
        }
        // ⬅ + ⬆
        if (characterItem.direction === 'Up+Left') {
          keydown = true;
          isEulerChanged = true;
          euler.y = euler.y + angle135;
          moveDirection = forward.add(Vector3.Cross(forward, Vector3.Up())).normalize();
        }
        // ⬆ + ⮕
        if (characterItem.direction === 'Up+Right') {
          keydown = true;
          isEulerChanged = true;
          euler.y = euler.y - angle135;
          moveDirection = forward.add(Vector3.Cross(Vector3.Up(), forward)).normalize();
        }
        // ⬅ + ⬇
        if (characterItem.direction === 'Down+Left') {
          keydown = true;
          isEulerChanged = true;
          euler.y = euler.y + angle45;
          moveDirection = forward.negate().add(Vector3.Cross(forward, Vector3.Up())).normalize();
        }
        // ⬇ + ⮕
        if (characterItem.direction === 'Down+Right') {
          keydown = true;
          isEulerChanged = true;
          euler.y = euler.y - angle45;
          moveDirection = forward.negate().add(Vector3.Cross(Vector3.Up(), forward)).normalize();
        }
        if (keydown) {
          const quaternion = euler.toQuaternion().clone();
          // console.log('@@@ quaternion', JSON.stringify(quaternion));
          if (characterItem.characterBox.rotationQuaternion !== null) {
            characterItem.characterMeshes.forEach(o => {
              Quaternion.SlerpToRef(
                o.rotationQuaternion!,
                quaternion,
                0.1,
                o.rotationQuaternion!,
              );
            });
          }
          
          const currentVelocity = characterItem.characterBoxPhysicsBody.getLinearVelocity();
          let muliply = 3;
          if (characterItem.isRunning) {
            muliply = 6;
          }
          characterItem.characterBoxPhysicsBody.setLinearVelocity(new Vector3(moveDirection.x * muliply, currentVelocity.y, moveDirection.z * muliply));
        } else {
          // x축과 z축 속도를 0으로 설정, y축 속도는 유지
          const currentVelocity = characterItem.characterBoxPhysicsBody.getLinearVelocity();
          characterItem.characterBoxPhysicsBody.setLinearVelocity(new Vector3(0, currentVelocity.y, 0));
        }
        setIsThisClientCharacterControllingWrapper(characterItem.direction !== undefined, characterId);
        if (characterItem.isJumping) {
          setIsThisClientCharacterControllingWrapper(true, characterId);
          if (characterItem.jumpingInterval === undefined) {
            // 점프 코드 작성..
            idleAnim?.stop();
            jumpAnim?.start(false);

            const currentVelocity = characterItem.characterBoxPhysicsBody.getLinearVelocity();
            characterItem.jumpingInterval = setTimeout(() => {
              characterItem.characterBoxPhysicsBody.setLinearVelocity(new Vector3(moveDirection.x * 3, currentVelocity.y + 9, moveDirection.z * 3));
              setTimeout(() => {
                characterItem.isJumping = false;
                jumpAnim?.stop();
                idleAnim?.start(true);
                setIsThisClientCharacterControllingWrapper(false, characterId);
                clearTimeout(characterItem.jumpingInterval);
                characterItem.jumpingInterval = undefined;
              }, characterItem.jumpingDuration);
            }, characterItem.jumpingDelay);
          }
        }
        if (characterItem.jumpingInterval === undefined) {
          // console.log('keydown', keydown);
          if (keydown) {
            // console.log('keydown...', animating);
            // if (!animatingRef.current) {
            // animatingRef.current = true;
            idleAnim?.stop();
            // console.log('@@@ @@@ @@@');
            if (characterItem.isRunning) {
              walkingAnim?.stop();
              runningAnim?.start(true);
            } else {
              runningAnim?.stop();
              walkingAnim?.start(true);
            }
            // }
          } else {
            // if (animatingRef.current) {
            walkingAnim?.stop();
            runningAnim?.stop();
            idleAnim?.start(true);
              // animatingRef.current = false;
            // }
          }
        } else {
          setIsThisClientCharacterControllingWrapper(true, characterId);
          runningAnim?.stop();
          walkingAnim?.stop();
          idleAnim?.stop();
        }
      });
    },
  });

  return {
    add,
    remove,
    setThisClientCharacterId,
    setCharacterPositionAndRotation,
    setCharacterMoving,
    setCharacterJumping,
    getCharactersMap,
    getCharacter,
    isThisClientCharacterControlling,
    isThisClientCharacterLoaded,
  };
}