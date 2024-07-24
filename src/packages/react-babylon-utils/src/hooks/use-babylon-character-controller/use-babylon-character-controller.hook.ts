import { useRef, useState } from "react";
import { IUseBabylonCharacterController } from "./use-babylon-character-controller.interface";
import { AnimationGroup, AnimationPropertiesOverride, MeshBuilder, PhysicsBody, PhysicsMotionType, PhysicsShapeBox, Quaternion, SceneLoader, Vector3 } from "@babylonjs/core";
import { useRequestAnimationFrameManager } from "@wisdomstar94/react-request-animation-frame-manager";
import { calculateDistance3D } from "@/libs/utils";
import anime from "animejs";

const defaultAngularDamping = 100;
const defaultLinearDamping = 10000;

export function useBabylonCharacterController(props: IUseBabylonCharacterController.Props) {
  const {
    debugOptions,
    onAdded,
    thisClientCharacterOptions,
  } = props;

  const firstQuaternionWithCameraRef = useRef<Quaternion>();
  const thisClientCharacterIdRef = useRef(thisClientCharacterOptions?.characterId ?? '');
  const charactersRef = useRef<Map<string, IUseBabylonCharacterController.CharacterItem>>(new Map());
  const charactersAddingRef = useRef<Set<string>>(new Set());
  const [isThisClientCharacterControlling, setIsThisClientCharacterControlling] = useState(false);
  const [isThisClientCharacterLoaded, setIsThisClientCharacterLoaded] = useState(false);
  const [isExistThisClientCharacterNearOtherCharacters, setIsExistThisClientCharacterNearOtherCharacters] = useState(false);

  function setThisClientCharacterId(characterId: string) {
    thisClientCharacterIdRef.current = characterId;
  }

  async function add(params: IUseBabylonCharacterController.AddRequireInfo): Promise<undefined | IUseBabylonCharacterController.CharacterItem> {
    const {
      camera,
      characterId,
      characterVisibilityDelay,
      scene,
      glbFileUrl,
      characterSize,
      characterInitPosition,
      characterInitRotation,
      characterJumpingOptions,
      characterAnimationGroupNames,
      chracterPhysicsBodyOptions,
    } = params;

    const characterNickName = params.characterNickName ?? 'no named';

    const angularDamping = chracterPhysicsBodyOptions?.angularDamping ?? defaultAngularDamping;
    const linearDamping = chracterPhysicsBodyOptions?.linearDamping ?? defaultLinearDamping;

    const t = charactersRef.current.get(characterId);
    if (charactersAddingRef.current.has(characterId) || t !== undefined) {
      console.warn('이미 해당 캐릭터는 존재합니다.');
      return Promise.resolve(undefined);
    }

    charactersAddingRef.current.add(characterId);

    // 캐릭터와 맵핑할 메쉬

    // 캐릭터와 맵핑할 메쉬 :: 눈에 보여지는 부분
    const characterBox = MeshBuilder.CreateBox("box", { 
      width: characterSize.x,
      height: characterSize.y, 
      size: characterSize.z,
    }, scene);
    characterBox.position.x = characterInitPosition.x;
    characterBox.position.y = characterInitPosition.y;
    characterBox.position.z = characterInitPosition.z;
    // console.log(`characterBox.getPivotPoint()`, characterBox.getPivotPoint());
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
    characterBoxPhysicsBody.shape = new PhysicsShapeBox(
      new Vector3(0, 0, 0),
      Quaternion.Identity(),
      new Vector3(characterSize.x, characterSize.y, characterSize.z),
      scene,
    );
    characterBoxPhysicsBody.setMassProperties({ 
      // mass: typeof characterVisibilityDelay === 'number' ? 0 : 1, 
      mass: 0.7,
      // inertia: new Vector3(0, 0, 0), 
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
    const result = SceneLoader.ImportMeshAsync(undefined, glbFileUrl.baseUrl, glbFileUrl.filename, scene).then((result) => {
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

        console.log(`mesh.getPivotPoint()`, mesh.getPivotPoint());
        mesh.setPivotPoint(new Vector3(0, - characterSize.y / 2, 0));

        mesh.scaling.scaleInPlace(0.01);
        if (characterInitRotation !== undefined) {
          const newQ = Quaternion.Identity();
          newQ.x = characterInitRotation.x;
          newQ.y = characterInitRotation.y;
          newQ.z = characterInitRotation.z;
          newQ.w = characterInitRotation.w;
          mesh.rotationQuaternion = newQ;
        } else if (quaternion !== undefined) {
          mesh.rotationQuaternion = quaternion;
        } else if (firstQuaternionWithCameraRef.current !== undefined) {
          mesh.rotationQuaternion = firstQuaternionWithCameraRef.current.clone();
        } else {
          mesh.rotationQuaternion = Quaternion.Identity();
        }

        if (typeof characterVisibilityDelay === 'number') {
          mesh.visibility = 0;
        }
      });

      setTimeout(() => {
        characterMeshes.forEach(mesh => mesh.visibility = 1);
        characterBoxPhysicsBody.setMassProperties({ 
          mass: 1, 
          inertia: new Vector3(0, 0, 0), 
        });
      }, characterVisibilityDelay);

      characterLoaderResult.animationGroups.forEach(anim => {
        characterAnimationGroups.set(anim.name, anim);
      });

      const characterItem: IUseBabylonCharacterController.CharacterItem = {
        characterId,
        characterNickName,
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
        jumpingOptions: characterJumpingOptions,
        saveJumpingOptions: characterJumpingOptions,
        isJumping: false,
        isRunning: false,
        jumpingInterval: undefined,
        addRequireInfo: params,
        add: async(params2) => {
          const {
            groupName,
            babylonLogic,
            isAutoDeleteTimeout,
          } = params2;
          const isOriginalDeleteWhenDuplicated = params2.isOriginalDeleteWhenDuplicated ?? true;

          const deleteGroup = () => {
            const original = characterItem.addedGroups.get(groupName);
            clearTimeout(original?.autoDeleteTimeouter);
            if (original !== undefined) {
              const babylonLogicResult = original.babylonLogicResult;
              babylonLogicResult.meshes.forEach((mesh) => {
                mesh.dispose();
              });
              (babylonLogicResult.others ?? []).forEach((other) => {
                if (typeof other.dispose === 'function') {
                  other.dispose();
                }
              });
            }
            characterItem.addedGroups.delete(groupName);
          };

          if (isOriginalDeleteWhenDuplicated === true) {
            deleteGroup();
          }

          let autoDeleteTimeouter: NodeJS.Timeout | undefined = undefined;
          if (typeof isAutoDeleteTimeout === 'number') {
            autoDeleteTimeouter = setTimeout(() => {
              deleteGroup();
            }, isAutoDeleteTimeout);
          }

          const result = await babylonLogic();
          characterItem.addedGroups.set(groupName, {
            groupName,
            babylonLogicResult: result,
            autoDeleteTimeouter,
          });
        },
        addedGroups: new Map(),
        snapshotDumpings: {
          linearDamping,
          angularDamping,
        },
      };
      charactersRef.current.set(characterId, characterItem);
      charactersAddingRef.current.delete(characterId);
      if (typeof onAdded === 'function') {
        onAdded(characterItem, scene);
      }

      if (thisClientCharacterIdRef.current === characterId) {
        setIsThisClientCharacterLoaded(true);
      }

      checkNearUser();

      return characterItem;
    }).catch((error) => {
      console.error('에러 발생', error);
      return undefined;
    });
    return result;
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

  async function setCharacterPositionAndRotation(options: IUseBabylonCharacterController.CharacterPositionAndRotationOptions) {
    const {
      characterId,
      position,
      rotation,
      // notApplyPositionWhenNotBigDiffrenceOptions,
      // animateOptions,
    } = options;

    const targetCharacter = charactersRef.current.get(characterId);
    if (targetCharacter === undefined) {
      console.error('해당 id 로 등록된 캐릭터가 없습니다.');
      return;
    }

    // const isAnimate = animateOptions?.isAnimate ?? false;
    // const animateDuration = animateOptions?.duration ?? 300;
    // const isNotApplyPositionWhenNotBigDiffrence = notApplyPositionWhenNotBigDiffrenceOptions?.isNotApplyPositionWhenNotBigDiffrence ?? false;
    // const bigDifferenceDistance = notApplyPositionWhenNotBigDiffrenceOptions?.bigDifferenceDistance ?? 2;
    // const distance = calculateDistance3D({ x: position.x, y: position.y, z: position.z }, { x: targetCharacter.characterBox.position.x, y: targetCharacter.characterBox.position.y, z: targetCharacter.characterBox.position.z });

    // let isChangePosition = false;

    // const changePosition = () => {
    //   isChangePosition = true;
    //   targetCharacter.characterBoxPhysicsBody.setPrestepType(PhysicsPrestepType.TELEPORT);
    //   if (targetCharacter.isJumpPossible !== false) {
    //     if (isAnimate) {
    //       anime({
    //         targets: [targetCharacter.characterBox.position],
    //         x: position.x,
    //         y: position.y,
    //         z: position.z,
    //         duration: animateDuration,
    //       });
    //     } else {
    //       targetCharacter.characterBox.position.x = position.x;
    //       targetCharacter.characterBox.position.y = position.y;
    //       targetCharacter.characterBox.position.z = position.z;
    //     }
    //   } else {
    //     if (isAnimate) {
    //       anime({
    //         targets: [targetCharacter.characterBox.position],
    //         x: position.x,
    //         z: position.z,
    //         duration: animateDuration,
    //       });
    //     } else {
    //       targetCharacter.characterBox.position.x = position.x;
    //       targetCharacter.characterBox.position.z = position.z;
    //     }
    //   }
    // };

    // if (isNotApplyPositionWhenNotBigDiffrence === true) {
    //   if (distance >= bigDifferenceDistance) {
    //     changePosition();
    //   } 
    // } else {
    //   changePosition();
    // }

    // targetCharacter.characterBoxPhysicsBody.setMotionType(PhysicsMotionType.DYNAMIC);
    // targetCharacter.characterBoxPhysicsBody.setPrestepType(PhysicsPrestepType.ACTION);
    
    targetCharacter.characterBoxPhysicsBody.setTargetTransform(new Vector3(position.x, position.y, position.z), Quaternion.Identity());

    // if (isNotApplyPositionWhenNotBigDiffrence === true) {
    //   if (distance >= bigDifferenceDistance) {
    //     targetCharacter.characterBoxPhysicsBody.setTargetTransform(new Vector3(position.x, position.y, position.z), Quaternion.Identity());
    //   } 
    // } else {
    //   targetCharacter.characterBoxPhysicsBody.setTargetTransform(new Vector3(position.x, position.y, position.z), Quaternion.Identity());
    // }

    // const physicsEngine = targetCharacter.scene.getPhysicsEngine();
    // const plugIn = physicsEngine?.getPhysicsPlugin();
    // const hknp = (plugIn as any)['_hknp'];
    // if (typeof hknp.HP_Body_SetPosition === 'function') {
    //   const y = targetCharacter.isJumping ? targetCharacter.characterBox.position.y : position.y;
    //   hknp.HP_Body_SetPosition(targetCharacter.characterBoxPhysicsBody._pluginData.hpBodyId, [position.x, y, position.z]);
    // }

    if (rotation !== undefined) {
      targetCharacter.characterMeshes.forEach((mesh) => {
        if (mesh.rotationQuaternion !== null) {
          let newQ = mesh.rotationQuaternion.clone();
          newQ.x = rotation.x;
          newQ.y = rotation.y;
          newQ.z = rotation.z;
          newQ.w = rotation.w;
          mesh.rotationQuaternion = newQ;
        }
      });  
    }

    // if (!isChangePosition) {
    //   return;
    // } else {
    //   return await new Promise(function(resolve, reject) {
    //     setTimeout(() => {
    //       targetCharacter.characterBoxPhysicsBody.disablePreStep = true;
    //       resolve(undefined);
    //     }, 100);
    //   });
    // }
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

  function setCharacterJumping(characterId: string, jumpingOptions?: IUseBabylonCharacterController.CharacterJumpingOptions) {
    const targetCharacter = charactersRef.current.get(characterId);
    if (targetCharacter === undefined) {
      console.error('해당 id 로 등록된 캐릭터가 없습니다.');
      return;
    }

    if (targetCharacter.isJumping) return;
    targetCharacter.isJumping = true;
    if (thisClientCharacterIdRef.current !== characterId) {
      targetCharacter.characterBoxPhysicsBody.setGravityFactor(0);
      targetCharacter.characterBoxPhysicsBody.setLinearDamping(10000);
    }
    if (jumpingOptions !== undefined) {
      targetCharacter.jumpingOptions = jumpingOptions;
    } else {
      targetCharacter.jumpingOptions = targetCharacter.saveJumpingOptions;
    }
  }

  function getCharactersMap() {
    return charactersRef.current;
  }

  function getCharacter(characterId: string) {
    return charactersRef.current.get(characterId);
  }

  function setIsThisClientCharacterControllingWrapper(v: boolean, characterId: string) {
    if (characterId !== thisClientCharacterIdRef.current) return;
    setIsThisClientCharacterControlling(prev => v);
  }

  function checkNearUser() {
    const meCharacter = getCharacter(thisClientCharacterIdRef.current);
    if (meCharacter === undefined) return;

    const arr = Array.from(getCharactersMap());
    const target = arr.find(([characterId, characterItem]) => {
      if (characterId === meCharacter.characterId) return false; 

      const mePoint = (() => {
        const { x, y, z } = meCharacter.characterBox.position;
        return { x, y, z };
      })();
      const otherPoint = (() => {
        const { x, y, z } = characterItem.characterBox.position;
        return { x, y, z };
      })();

      const distance = calculateDistance3D(mePoint, otherPoint);
      if (distance < (thisClientCharacterOptions?.nearDistance ?? 2) && (characterItem.direction !== undefined || characterItem.jumpingInterval !== undefined)) {
        return true;
      } 

      return false;
    });
    const isExist = target !== undefined;
    setIsExistThisClientCharacterNearOtherCharacters(isExist);
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

        const forward = new Vector3(cameraDirection?.normalize().x, 0, cameraDirection?.normalize().z);
        const rot = Quaternion.FromLookDirectionLH(forward, Vector3.Up());
        const euler = rot.toEulerAngles();
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
          if (characterItem.isJumpPossible !== false) {
            // 점프 코드 작성..
            idleAnim?.stop();
            jumpAnim?.start(false);
            characterItem.isJumpPossible = false;

            const currentVelocity = characterItem.characterBoxPhysicsBody.getLinearVelocity();
            characterItem.jumpingInterval = setTimeout(() => {
              characterItem.characterBoxPhysicsBody.setLinearVelocity(new Vector3(moveDirection.x * 3, currentVelocity.y + 14, moveDirection.z * 3));
              setTimeout(() => {
                characterItem.isJumping = false;
                setIsThisClientCharacterControllingWrapper(false, characterId);
                clearTimeout(characterItem.jumpingInterval);
                characterItem.jumpingInterval = undefined;
                jumpAnim?.stop();
                idleAnim?.start(true);
              }, characterItem.jumpingOptions.jumpingAnimationDuration);
            }, characterItem.jumpingOptions.jumpingAnimationStartDelay);

            setTimeout(() => {
              characterItem.isJumpPossible = true;
              if (characterItem.characterBoxPhysicsBody.getMotionType() !== PhysicsMotionType.DYNAMIC) {
                characterItem.characterBoxPhysicsBody.setMotionType(PhysicsMotionType.DYNAMIC);
              }
              characterItem.characterBoxPhysicsBody.setGravityFactor(1);
              characterItem.characterBoxPhysicsBody.setLinearDamping(characterItem.snapshotDumpings.linearDamping);
            }, characterItem.jumpingOptions.jumpingTotalDuration);
          }
        }
        if (characterItem.jumpingInterval === undefined) {
          if (keydown) {
            // if (!animatingRef.current) {
            // animatingRef.current = true;
            idleAnim?.stop();
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
          // idleAnim?.stop();
        }
      });
      checkNearUser();
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
    isExistThisClientCharacterNearOtherCharacters,
  };
}