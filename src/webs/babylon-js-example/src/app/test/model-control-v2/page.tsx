"use client"

import { useRef } from "react";
import { Scene } from "@babylonjs/core/scene";
import { Quaternion, Vector3 } from "@babylonjs/core/Maths/math";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { ActionManager, AnimationGroup, AnimationPropertiesOverride, ArcRotateCamera, AxesViewer, ExecuteCodeAction, HavokPlugin, ISceneLoaderAsyncResult, Mesh, MeshBuilder, PhysicsBody, PhysicsMotionType, PhysicsShapeBox, PhysicsShapeCylinder, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import HavokPhysics from "@babylonjs/havok";
import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";
import { useRequestAnimationFrameManager } from "@wisdomstar94/react-request-animation-frame-manager";
import { BabylonCanvas, IBabylonCanvas } from "@wisdomstar94/react-babylon-utils";
// import anime from 'animejs/lib/anime.es.js';

export default function Page() {
  const moveSpeedRef = useRef(0.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<ArcRotateCamera>();
  const characterLoaderInfoRef = useRef<ISceneLoaderAsyncResult>();
  const characterAnimationGroupsRef = useRef<Map<string, AnimationGroup>>(new Map());
  const characterBoxRef = useRef<Mesh>();
  const characterBoxPhysicsBodyRef = useRef<PhysicsBody>();
  const animatingRef = useRef(true);

  const keyDownMap = useRef<Map<string, boolean>>(new Map());

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'keyup',
      eventListener(event) {
        const key = event.key;
        keyDownMap.current.set(key, false);
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'keydown',
      eventListener(event) {
        const key = event.key;
        keyDownMap.current.set(key, true);
      },
    },
  });

  const requestAnimationFrameManager = useRequestAnimationFrameManager({
    isAutoStart: true,
    callback(startedTimestamp, currentTimestamp, step) {
      const camera = cameraRef.current;
      if (camera === undefined) return;

      const characterLoaderInfo = characterLoaderInfoRef.current;
      if (characterLoaderInfo === undefined) return;

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

      const walkingAnim = characterAnimationGroupsRef.current.get('walking');
      const idleAnim = characterAnimationGroupsRef.current.get('idle');
      const jumpAnim = characterAnimationGroupsRef.current.get('jump');

      // ⬆
      if (keyDownMap.current.get('w') && !keyDownMap.current.get('a') && !keyDownMap.current.get('s') && !keyDownMap.current.get('d')) {
        console.log('⬆');
        isEulerChanged = true;
        // euler.y = euler.y;
        euler.y = euler.y + angle180;
        moveDirection = forward;
      }
      // ⬇
      if (!keyDownMap.current.get('w') && !keyDownMap.current.get('a') && keyDownMap.current.get('s') && !keyDownMap.current.get('d')) {
        console.log('⬇');
        isEulerChanged = true;
        // euler.y = euler.y + angle180;
        euler.y = euler.y;
        moveDirection = forward.negate();
      }
      // ⬅
      if (!keyDownMap.current.get('w') && keyDownMap.current.get('a') && !keyDownMap.current.get('s') && !keyDownMap.current.get('d')) {
        console.log('⬅');
        isEulerChanged = true;
        // euler.y = euler.y - angle90;
        euler.y = euler.y + angle90;
        moveDirection = Vector3.Cross(forward, Vector3.Up()).normalize();
      }
      // ⮕
      if (!keyDownMap.current.get('w') && !keyDownMap.current.get('a') && !keyDownMap.current.get('s') && keyDownMap.current.get('d')) {
        console.log('⮕');
        isEulerChanged = true;
        // euler.y = euler.y + angle90;
        euler.y = euler.y - angle90;
        moveDirection = Vector3.Cross(Vector3.Up(), forward).normalize();
      }
      // ⬅ + ⬆
      if (keyDownMap.current.get('w') && keyDownMap.current.get('a') && !keyDownMap.current.get('s') && !keyDownMap.current.get('d')) {
        console.log('⬅ + ⬆');
        isEulerChanged = true;
        // euler.y = euler.y - angle45;
        euler.y = euler.y + angle135;
        moveDirection = forward.add(Vector3.Cross(forward, Vector3.Up())).normalize();
      }
      // ⬆ + ⮕
      if (keyDownMap.current.get('w') && !keyDownMap.current.get('a') && !keyDownMap.current.get('s') && keyDownMap.current.get('d')) {
        console.log('⬆ + ⮕');
        isEulerChanged = true;
        // euler.y = euler.y + angle45;
        euler.y = euler.y - angle135;
        moveDirection = forward.add(Vector3.Cross(Vector3.Up(), forward)).normalize();
      }
      // ⬅ + ⬇
      if (!keyDownMap.current.get('w') && keyDownMap.current.get('a') && keyDownMap.current.get('s') && !keyDownMap.current.get('d')) {
        console.log('⬅ + ⬇');
        isEulerChanged = true;
        // euler.y = euler.y - angle135;
        euler.y = euler.y + angle45;
        moveDirection = forward.negate().add(Vector3.Cross(forward, Vector3.Up())).normalize();
      }
      // ⬇ + ⮕
      if (!keyDownMap.current.get('w') && !keyDownMap.current.get('a') && keyDownMap.current.get('s') && keyDownMap.current.get('d')) {
        console.log('⬇ + ⮕');
        isEulerChanged = true;
        // euler.y = euler.y + angle135;
        euler.y = euler.y - angle45;
        moveDirection = forward.negate().add(Vector3.Cross(Vector3.Up(), forward)).normalize();
      }
      if (keyDownMap.current.get('w') || keyDownMap.current.get('a') || keyDownMap.current.get('s') || keyDownMap.current.get('d')) {
        keydown = true;
        const quaternion = euler.toQuaternion().clone();
        if (characterBox.rotationQuaternion !== null) {
          characterLoaderInfo.meshes.forEach(o => {
            Quaternion.SlerpToRef(
              o.rotationQuaternion!,
              quaternion,
              0.1,
              o.rotationQuaternion!,
            );
          });
        }
        
        const currentVelocity = characterBoxPhysicsBody.getLinearVelocity();
        characterBoxPhysicsBody.setLinearVelocity(new Vector3(moveDirection.x * 3, currentVelocity.y, moveDirection.z * 3));
      } else {
        // x축과 z축 속도를 0으로 설정, y축 속도는 유지
        const currentVelocity = characterBoxPhysicsBody.getLinearVelocity();
        characterBoxPhysicsBody.setLinearVelocity(new Vector3(0, currentVelocity.y, 0));
      }
      if (keyDownMap.current.get(' ')) {
        if (characterBox.state !== 'jumping') {
          characterBox.state = 'jumping';
          // 점프 코드 작성..
          idleAnim?.stop();
          jumpAnim?.start(false);

          const currentVelocity = characterBoxPhysicsBody.getLinearVelocity();
          setTimeout(() => {
            console.log('jump start!');
            animatingRef.current = false;
            characterBoxPhysicsBody.setLinearVelocity(new Vector3(moveDirection.x * 3, currentVelocity.y + 9, moveDirection.z * 3));
            setTimeout(() => {
              console.log('jump end!', { keydown });
              characterBox.state = '';
              jumpAnim?.stop();
              idleAnim?.start(true);
            }, 850);
          }, 500);
        }
      }
      if (characterBox.state !== 'jumping') {
        if (keydown) {
          // console.log('keydown...', animating);
          if (!animatingRef.current) {
            animatingRef.current = true;
            idleAnim?.stop();
            walkingAnim?.start(true);
          }
        } else {
          if (animatingRef.current) {
            walkingAnim?.stop();
            idleAnim?.start(true);
            animatingRef.current = false;
          }
        }
      } else {
        idleAnim?.stop();
        walkingAnim?.stop();
      }
    },
  });

  async function onReady(initInfo: IBabylonCanvas.InitInfo) {
    const {
      engines, 
      scene,
      canvas,
    } = initInfo;

    const engine = engines.engine;
    scene.actionManager = new ActionManager(scene);

    const axes = new AxesViewer(scene);

    const camera = new ArcRotateCamera("camera1", Math.PI / 2, -Math.PI / 4, 10, new Vector3(5, 0.4, 0), scene);
    cameraRef.current = camera;
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 5; // 캐릭터와 카메라 간의 최소 거리 (이 값보다 더 가까워 지지 않음)

    const gravityVector = new Vector3(0, -11.81, 0);
    const havokInstance = await HavokPhysics();
    const physicsPlugin = new HavokPlugin(undefined, havokInstance);
    scene.enablePhysics(gravityVector, physicsPlugin);

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const ground = MeshBuilder.CreateGround("ground1", { width: 40, height: 40 });
    ground.position.y = 0;
    ground.receiveShadows = true;

    // 캐릭터와 맵핑할 메쉬
    const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position.y = 5;
    box.position.x = 5;
    box.rotationQuaternion = Quaternion.Identity();
    box.visibility = 0;
    camera.setTarget(box);
    characterBoxRef.current = box;

    // (window as any).box = box;

    const boxBody = new PhysicsBody(box, PhysicsMotionType.DYNAMIC, false, scene);
    boxBody.shape = new PhysicsShapeCylinder(
      new Vector3(0, -0.5, 0),
      new Vector3(0, 2, 0),
      0.9,
      scene
    );
    boxBody.setMassProperties({ mass: 1, inertia: new Vector3(0, 0, 0) });
    boxBody.setAngularDamping(100);
    boxBody.setLinearDamping(10);
    characterBoxPhysicsBodyRef.current = boxBody;

    // 바닥과 맵핑할 메쉬
    const groundBody = new PhysicsBody(ground, PhysicsMotionType.STATIC, false, scene);
    groundBody.shape = new PhysicsShapeBox(
      new Vector3(0, 0, 0),
      Quaternion.Identity(),
      new Vector3(40, 0.1, 40),
      scene,
    );
    groundBody.setMassProperties({ mass: 0 });

    // fixedBox
    const fixedBox = MeshBuilder.CreateBox("box2", { size: 2 }, scene);
    fixedBox.position.y = 1;
    fixedBox.visibility = 1;

    const fixedBoxBody = new PhysicsBody(fixedBox, PhysicsMotionType.STATIC, false, scene);
    fixedBoxBody.shape = new PhysicsShapeBox(
      new Vector3(0, 0, 0),
      Quaternion.Identity(),
      new Vector3(2, 2, 2),
      scene,
    );
    fixedBoxBody.setMassProperties({ mass: 0 });

    // model import!!!
    SceneLoader.ImportMeshAsync(undefined, "/models/", "untitled.glb", scene).then((result) => {
      console.log('@result', result);
      characterLoaderInfoRef.current = result;

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

      characterLoaderInfoRef.current.meshes.forEach(o => {
        o.parent = box;
        o.scaling.scaleInPlace(0.01);
        o.position.y = -0.5;
        o.rotationQuaternion = quaternion;
        camera.setTarget(o);
      });

      // const walkingAnim = characterLoaderInfoRef.current.animationGroups.find(k => k.name === 'walking');
      // const idleAnim = characterLoaderInfoRef.current.animationGroups.find(k => k.name === 'idle');
      // const jumpAnim = characterLoaderInfoRef.current.animationGroups.find(k => k.name === 'jump');
      characterLoaderInfoRef.current.animationGroups.forEach((item) => {
        characterAnimationGroupsRef.current.set(item.name, item);
      });
    });

    engine.runRenderLoop(() => {
      scene.render();
    });
  }

  return (
    <>
      <div className="w-full h-full bg-blue-200 relative">
        <div className="w-1/2 aspect-square relative">
          <BabylonCanvas onReady={onReady} />
        </div>
      </div>
    </>
  );
}