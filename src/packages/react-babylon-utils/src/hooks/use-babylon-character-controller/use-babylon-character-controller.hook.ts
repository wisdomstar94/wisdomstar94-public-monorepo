import { useEffect, useRef, useState } from "react";
import { IUseBabylonCharacterController } from "./use-babylon-character-controller.interface";
import { AbstractMesh, AnimationGroup, AnimationPropertiesOverride, ArcRotateCamera, ISceneLoaderAsyncResult, Matrix, Mesh, MeshBuilder, PhysicsBody, PhysicsMotionType, PhysicsShapeCylinder, Quaternion, Scene, SceneLoader, Vector3 } from "@babylonjs/core";
import { useRequestAnimationFrameManager } from "@wisdomstar94/react-request-animation-frame-manager";

export function useBabylonCharacterController(props: IUseBabylonCharacterController.Props) {
  const {
    debugOptions,
    animationGroupNames,
    onLoaded,
  } = props;

  const [inited, setInited] = useState(false);

  const cameraRef = useRef<ArcRotateCamera>();
  const sceneRef = useRef<Scene>();
  // const keyDownMap = useRef<Map<string, boolean>>(new Map());
  const characterLoaderResultRef = useRef<ISceneLoaderAsyncResult>();
  const characterMeshesRef = useRef<AbstractMesh[]>();
  const characterAnimationGroupsRef = useRef<Map<string, AnimationGroup>>(new Map());
  const characterBoxRef = useRef<Mesh>();
  const characterBoxPhysicsBodyRef = useRef<PhysicsBody>();

  const directionRef = useRef<IUseBabylonCharacterController.CharacterGoDirection>();
  const jumpingDelay = useRef(500);
  const jumpingDuration = useRef(850);
  const isJumpingRef = useRef(false);
  const isRunningRef = useRef(false);

  const jumpingInterval = useRef<NodeJS.Timeout>();

  function init(params: IUseBabylonCharacterController.InitRequireInfo) {
    const {
      camera,
      scene,
      glbFileUrl,
      characterSize,
      characterInitPosition,
    } = params;

    cameraRef.current = camera;
    sceneRef.current = scene;

    // 캐릭터와 맵핑할 메쉬

    // 캐릭터와 맵핑할 메쉬 :: 눈에 보여지는 부분
    characterBoxRef.current = MeshBuilder.CreateCylinder("box", { 
      height: characterSize.y, 
      diameter: characterSize.x,
    }, scene);
    characterBoxRef.current.position.x = characterInitPosition.x;
    characterBoxRef.current.position.y = characterInitPosition.y;
    characterBoxRef.current.position.z = characterInitPosition.z;
    characterBoxRef.current.rotationQuaternion = Quaternion.Identity();
    // characterBoxRef.current.setPivotMatrix(Matrix.Translation(0, characterSize.y / 2, 0), false);
    // characterBoxRef.current.translate(Axis.Y, characterSize.y);
    // characterBoxRef.current.setPivotMatrix(Matrix.Translation(0, characterSize.y / 2, 0), false);
    // characterBoxRef.current.setPivotPoint(new Vector3(0, -characterSize.y / 2, 0));
    
    characterBoxRef.current.visibility = debugOptions?.isShowCharacterParentBoxMesh === true ? 1 : 0;

    // 캐릭터와 맵핑할 메쉬 :: 눈에 안보이는 물리적 세계에 존재하는 부분
    characterBoxPhysicsBodyRef.current = new PhysicsBody(
      characterBoxRef.current, 
      PhysicsMotionType.DYNAMIC, 
      false, 
      scene,
    );
    characterBoxPhysicsBodyRef.current.shape = new PhysicsShapeCylinder(
      new Vector3(0, 0, 0),
      new Vector3(0, characterSize.y, 0),
      characterSize.x,
      scene,
    );
    characterBoxPhysicsBodyRef.current.setMassProperties({ 
      mass: 1, 
      inertia: new Vector3(0, 0, 0), 
    });
    characterBoxPhysicsBodyRef.current.setAngularDamping(100);
    characterBoxPhysicsBodyRef.current.setLinearDamping(10);

    // 카메라 설정
    camera.alpha = Math.PI / 2;
    camera.beta = -Math.PI / 2.5;
    camera.radius = 10;
    camera.position.x = characterBoxRef.current.position.x;
    camera.position.y = characterBoxRef.current.position.y + 3;
    camera.position.z = characterBoxRef.current.position.z - 10;
    camera.setTarget(characterBoxRef.current);

    // model import!!!
    SceneLoader.ImportMeshAsync(undefined, glbFileUrl.baseUrl, glbFileUrl.filename, scene).then((result) => {
      // console.log('@result', result);
      characterLoaderResultRef.current = result;
      characterMeshesRef.current = characterLoaderResultRef.current.meshes;
      // characterAnimationGroupsRef.current = characterLoaderResult.current.animationGroups;

      // animation group 간에 부드럽게 전환되는 효과를 위해서는 아래와 같이 작성해주어야 함.
      if (scene.animationPropertiesOverride === null) {
        scene.animationPropertiesOverride = new AnimationPropertiesOverride();
        scene.animationPropertiesOverride.enableBlending = true;
        scene.animationPropertiesOverride.blendingSpeed = 0.05;
      }

      // 초기 캐릭터가 바라보는 방향 셋팅을 위한 로직
      const { direction } = camera.getForwardRay();
      const forward = new Vector3(direction.normalize().x, 0, direction.normalize().z);
      const rot = Quaternion.FromLookDirectionLH(forward, Vector3.Up());
      const euler = rot.toEulerAngles();
      const quaternion = euler.toQuaternion();

      characterMeshesRef.current.forEach(mesh => {
        if (characterBoxRef.current !== undefined) {
          mesh.parent = characterBoxRef.current;
        }
        mesh.scaling.scaleInPlace(0.01);
        mesh.rotationQuaternion = quaternion;
      });

      characterLoaderResultRef.current.animationGroups.forEach(anim => {
        characterAnimationGroupsRef.current.set(anim.name, anim);
      });

      setInited(true);
    }).catch((error) => {
      console.error('에러 발생', error);
    });
  }

  function setCharacterPosition(position: IUseBabylonCharacterController.Vector3) {
    if (!inited) {
      console.error('아직 초기화되지 않았습니다.');
      return;
    }

    // ..
    const characterBox = characterBoxRef.current;
    if (characterBox === undefined) return;

    characterBox.position.x = position.x;
    characterBox.position.y = position.y;
    characterBox.position.z = position.z;
  }

  function setCharacterMoving(direction: IUseBabylonCharacterController.CharacterGoDirection | undefined, isRunning?: boolean) {
    directionRef.current = direction;
    isRunningRef.current = isRunning ?? false;
  }

  function setCharacterJumping(delay: number, duration: number) {
    if (isJumpingRef.current) return;
    isJumpingRef.current = true;
    jumpingDelay.current = delay;
    jumpingDuration.current = duration;
  }

  useRequestAnimationFrameManager({
    isAutoStart: true,
    callback(startedTimestamp, currentTimestamp, step) {
      const camera = cameraRef.current;
      if (camera === undefined) return;

      const characterLoaderResult = characterLoaderResultRef.current;
      if (characterLoaderResult === undefined) return;

      const characterMeshes = characterMeshesRef.current;
      if (characterMeshes === undefined) return;

      const characterBox = characterBoxRef.current;
      if (characterBox === undefined) return;

      const characterBoxPhysicsBody = characterBoxPhysicsBodyRef.current;
      if (characterBoxPhysicsBody === undefined) return;

      const { direction } = camera.getForwardRay();
      // const forward = camera.getDirection(new Vector3(0, 0, 1)).normalize();
      const forward = new Vector3(direction.normalize().x, 0, direction.normalize().z);
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

      const walkingAnim = characterAnimationGroupsRef.current.get(animationGroupNames?.walkingAnimationGroupName ?? '');
      const idleAnim = characterAnimationGroupsRef.current.get(animationGroupNames?.idleAnimationGroupName ?? '');
      const jumpAnim = characterAnimationGroupsRef.current.get(animationGroupNames?.jumpingAnimationGroupName ?? '');
      const runningAnim = characterAnimationGroupsRef.current.get(animationGroupNames?.runningAnimationGroupName ?? '');

      // ⬆
      if (directionRef.current === 'Up') {
        keydown = true;
        isEulerChanged = true;
        euler.y = euler.y + angle180;
        moveDirection = forward;
      }
      // ⬇
      if (directionRef.current === 'Down') {
        keydown = true;
        isEulerChanged = true;
        euler.y = euler.y;
        moveDirection = forward.negate();
      }
      // ⬅
      if (directionRef.current === 'Left') {
        keydown = true;
        isEulerChanged = true;
        euler.y = euler.y + angle90;
        moveDirection = Vector3.Cross(forward, Vector3.Up()).normalize();
      }
      // ⮕
      if (directionRef.current === 'Right') {
        keydown = true;
        isEulerChanged = true;
        euler.y = euler.y - angle90;
        moveDirection = Vector3.Cross(Vector3.Up(), forward).normalize();
      }
      // ⬅ + ⬆
      if (directionRef.current === 'Up+Left') {
        keydown = true;
        isEulerChanged = true;
        euler.y = euler.y + angle135;
        moveDirection = forward.add(Vector3.Cross(forward, Vector3.Up())).normalize();
      }
      // ⬆ + ⮕
      if (directionRef.current === 'Up+Right') {
        keydown = true;
        isEulerChanged = true;
        euler.y = euler.y - angle135;
        moveDirection = forward.add(Vector3.Cross(Vector3.Up(), forward)).normalize();
      }
      // ⬅ + ⬇
      if (directionRef.current === 'Down+Left') {
        keydown = true;
        isEulerChanged = true;
        euler.y = euler.y + angle45;
        moveDirection = forward.negate().add(Vector3.Cross(forward, Vector3.Up())).normalize();
      }
      // ⬇ + ⮕
      if (directionRef.current === 'Down+Right') {
        keydown = true;
        isEulerChanged = true;
        euler.y = euler.y - angle45;
        moveDirection = forward.negate().add(Vector3.Cross(Vector3.Up(), forward)).normalize();
      }
      if (keydown) {
        const quaternion = euler.toQuaternion().clone();
        if (characterBox.rotationQuaternion !== null) {
          characterMeshes.forEach(o => {
            Quaternion.SlerpToRef(
              o.rotationQuaternion!,
              quaternion,
              0.1,
              o.rotationQuaternion!,
            );
          });
        }
        
        const currentVelocity = characterBoxPhysicsBody.getLinearVelocity();
        let muliply = 3;
        if (isRunningRef.current) {
          muliply = 6;
        }
        characterBoxPhysicsBody.setLinearVelocity(new Vector3(moveDirection.x * muliply, currentVelocity.y, moveDirection.z * muliply));
      } else {
        // x축과 z축 속도를 0으로 설정, y축 속도는 유지
        const currentVelocity = characterBoxPhysicsBody.getLinearVelocity();
        characterBoxPhysicsBody.setLinearVelocity(new Vector3(0, currentVelocity.y, 0));
      }
      if (isJumpingRef.current) {
        if (jumpingInterval.current === undefined) {
          // 점프 코드 작성..
          idleAnim?.stop();
          jumpAnim?.start(false);

          const currentVelocity = characterBoxPhysicsBody.getLinearVelocity();
          jumpingInterval.current = setTimeout(() => {
            characterBoxPhysicsBody.setLinearVelocity(new Vector3(moveDirection.x * 3, currentVelocity.y + 9, moveDirection.z * 3));
            setTimeout(() => {
              isJumpingRef.current = false;
              jumpAnim?.stop();
              idleAnim?.start(true);
              clearTimeout(jumpingInterval.current);
              jumpingInterval.current = undefined;
            }, jumpingDuration.current);
          }, jumpingDelay.current);
        }
      }
      if (jumpingInterval.current === undefined) {
        // console.log('keydown', keydown);
        if (keydown) {
          // console.log('keydown...', animating);
          // if (!animatingRef.current) {
          // animatingRef.current = true;
          idleAnim?.stop();
          // console.log('@@@ @@@ @@@');
          if (isRunningRef.current) {
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
        runningAnim?.stop();
        walkingAnim?.stop();
        idleAnim?.stop();
      }
    },
  });

  useEffect(() => {
    if (!inited) return;

    const characterLoaderResult = characterLoaderResultRef.current;
    if (characterLoaderResult === undefined) throw new Error(`캐릭터가 정상적으로 로드되지 않았습니다.`);

    const characterMeshes = characterMeshesRef.current;
    if (characterMeshes === undefined) throw new Error(`캐릭터 메쉬가 정상적으로 로드되지 않았습니다.`);

    const characterAnimationGroups = characterAnimationGroupsRef.current;
    if (characterAnimationGroups === undefined) throw new Error(`캐릭터 애니메이션 그룹이 정상적으로 로드되지 않았습니다.`);

    const characterBox = characterBoxRef.current;
    if (characterBox === undefined) throw new Error(`캐릭터 박스 메쉬가 정상적으로 로드되지 않았습니다.`);

    const characterBoxPhysicsBody = characterBoxPhysicsBodyRef.current;
    if (characterBoxPhysicsBody === undefined) throw new Error(`캐릭터 물리 가상 박스가 정상적으로 로드되지 않았습니다.`);

    if (typeof onLoaded === 'function') {
      onLoaded({
        characterLoaderResult,
        characterMeshes,
        characterAnimationGroups,
        characterBox,
        characterBoxPhysicsBody,
      });
    }
  }, [inited]);

  return {
    init,
    inited,
    setCharacterPosition,
    setCharacterMoving,
    setCharacterJumping,
  };
}