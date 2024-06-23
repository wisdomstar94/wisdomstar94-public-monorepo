"use client"

import { BabylonCanvas } from "@/components/babylon-canvas/babylon-canvas.component";
import { useRef } from "react";
import { Scene } from "@babylonjs/core/scene";
import { Quaternion, Vector3 } from "@babylonjs/core/Maths/math";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { ActionManager, AnimationPropertiesOverride, ArcRotateCamera, AxesViewer, ExecuteCodeAction, HavokPlugin, ISceneLoaderAsyncResult, MeshBuilder, PhysicsBody, PhysicsMotionType, PhysicsShapeBox, PhysicsShapeCylinder, SceneLoader } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { IBabylonCanvas } from "@/components/babylon-canvas/babylon-canvas.interface";
import HavokPhysics from "@babylonjs/havok";
// import anime from 'animejs/lib/anime.es.js';

export default function Page() {
  const moveSpeedRef = useRef(0.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<ISceneLoaderAsyncResult>();
  const cameraRef = useRef<ArcRotateCamera>();

  async function onReady(engines: IBabylonCanvas.Engines) {
    console.log('@canvasRef', canvasRef); 
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const engine = engines.engine;
    const scene = new Scene(engine);
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

    (window as any).box = box;

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
      modelRef.current = result;

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

      result.meshes.forEach(o => {
        o.parent = box;
        o.scaling.scaleInPlace(0.01);
        o.position.y = -0.5;
        o.rotationQuaternion = quaternion;
        camera.setTarget(o);
      });

      const walkingAnim = result.animationGroups.find(k => k.name === 'walking');
      const idleAnim = result.animationGroups.find(k => k.name === 'idle');
      const jumpAnim = result.animationGroups.find(k => k.name === 'jump');

      (window as any).test = {
        walkingAnim,
        idleAnim,
        jumpAnim,
      };

      idleAnim?.start(true);

      let inputMap: Record<string, any> = {};

      scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
      }));
      scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
      }));

      const angle180 = Math.PI;
      const angle45 = angle180 / 4;
      const angle90 = angle180 / 2;
      const angle135 = angle45 + angle90;
      let animating = true;

      scene.onBeforeRenderObservable.add(() => {
        const { direction } = camera.getForwardRay();
        // const forward = camera.getDirection(new Vector3(0, 0, 1)).normalize();
        const forward = new Vector3(direction.normalize().x, 0, direction.normalize().z);
        const rot = Quaternion.FromLookDirectionLH(forward, Vector3.Up());
        const euler = rot.toEulerAngles();
        // const euler = box.rotationQuaternion!.toEulerAngles();
        let keydown = false;
        let moveDirection = new Vector3(0, 0, 0);
        let isEulerChanged = false;

        // only 'w' (Up Arrow)
        if (inputMap['w'] && !inputMap['d'] && !inputMap['a']) {
          isEulerChanged = true;
          // euler.y = euler.y;
          euler.y = euler.y + angle180;
          moveDirection = forward;
        }
        // only 's' (Down Arrow)
        if (inputMap['s'] && !inputMap['d'] && !inputMap['a']) {
          isEulerChanged = true;
          // euler.y = euler.y + angle180;
          euler.y = euler.y;
          moveDirection = forward.negate();
        }
        // only 'a' (Left Arrow)
        if (inputMap['a'] && !inputMap['w'] && !inputMap['s']) {
          isEulerChanged = true;
          // euler.y = euler.y - angle90;
          euler.y = euler.y + angle90;
          moveDirection = Vector3.Cross(forward, Vector3.Up()).normalize();
        }
        // only 'd' (Right Arrow)
        if (inputMap['d'] && !inputMap['w'] && !inputMap['s']) {
          isEulerChanged = true;
          // euler.y = euler.y + angle90;
          euler.y = euler.y - angle90;
          moveDirection = Vector3.Cross(Vector3.Up(), forward).normalize();
        }
        // (Up Arrow + Right Arrow)
        if (inputMap['w'] && inputMap['d']) {
          isEulerChanged = true;
          // euler.y = euler.y + angle45;
          euler.y = euler.y - angle135;
          moveDirection = forward.add(Vector3.Cross(Vector3.Up(), forward)).normalize();
        }
        // (Up Arrow + Left Arrow)
        if (inputMap['w'] && inputMap['a']) {
          isEulerChanged = true;
          // euler.y = euler.y - angle45;
          euler.y = euler.y + angle135;
          moveDirection = forward.add(Vector3.Cross(forward, Vector3.Up())).normalize();
        }
        // (Down Arrow + Right Arrow)
        if (inputMap['s'] && inputMap['d']) {
          isEulerChanged = true;
          // euler.y = euler.y + angle135;
          euler.y = euler.y - angle45;
          moveDirection = forward.negate().add(Vector3.Cross(Vector3.Up(), forward)).normalize();
        }
        // (Down Arrow + Left Arrow)
        if (inputMap['s'] && inputMap['a']) {
          isEulerChanged = true;
          // euler.y = euler.y - angle135;
          euler.y = euler.y + angle45;
          moveDirection = forward.negate().add(Vector3.Cross(forward, Vector3.Up())).normalize();
        }
        if (inputMap['w'] || inputMap['s'] || inputMap['a'] || inputMap['d']) {
          keydown = true;
          const quaternion = euler.toQuaternion().clone();
          if (box.rotationQuaternion !== null) {
            result.meshes.forEach(o => {
              Quaternion.SlerpToRef(
                o.rotationQuaternion!,
                quaternion,
                0.1,
                o.rotationQuaternion!,
              );
            });
          }
          
          const currentVelocity = boxBody.getLinearVelocity();
          boxBody.setLinearVelocity(new Vector3(moveDirection.x * 3, currentVelocity.y, moveDirection.z * 3));
        } else {
          // x축과 z축 속도를 0으로 설정, y축 속도는 유지
          const currentVelocity = boxBody.getLinearVelocity();
          boxBody.setLinearVelocity(new Vector3(0, currentVelocity.y, 0));
        }
        if (inputMap[' ']) {
          if (box.state !== 'jumping') {
            box.state = 'jumping';
            // 점프 코드 작성..
            idleAnim?.stop();
            jumpAnim?.start(false);

            const currentVelocity = boxBody.getLinearVelocity();
            setTimeout(() => {
              console.log('jump start!');
              animating = false;
              boxBody.setLinearVelocity(new Vector3(moveDirection.x * 3, currentVelocity.y + 9, moveDirection.z * 3));
              setTimeout(() => {
                console.log('jump end!', { keydown });
                box.state = '';
                jumpAnim?.stop();
                idleAnim?.start(true);
              }, 850);
            }, 500);
          }
        }
        if (box.state !== 'jumping') {
          if (keydown) {
            // console.log('keydown...', animating);
            if (!animating) {
              animating = true;
              idleAnim?.stop();
              walkingAnim?.start(true);
            }
          } else {
            if (animating) {
              walkingAnim?.stop();
              idleAnim?.start(true);
              animating = false;
            }
          }
        } else {
          idleAnim?.stop();
          walkingAnim?.stop();
        }

        if (!keydown && box.state !== 'jumping') {
          // console.log('!!?');
          // console.log({ 'walkingAnim?.isPlaying': walkingAnim?.isPlaying, 'idleAnim?.isPlaying': idleAnim?.isPlaying });

          // if (walkingAnim?.isPlaying) {
          //   console.log('@! 2');
          //   walkingAnim?.stop();
          // }
          // if (idleAnim?.isPlaying === false) {
          //   console.log('@! 1');
          //   idleAnim?.start(true);
          // }
        }
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
          <BabylonCanvas canvasRef={canvasRef} onReady={onReady} />
        </div>
      </div>
    </>
  );
}