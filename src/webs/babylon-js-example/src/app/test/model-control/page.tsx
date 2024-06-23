"use client"

import { BabylonCanvas } from "@/components/babylon-canvas/babylon-canvas.component";
import { useEffect, useRef } from "react";
import { Scene } from "@babylonjs/core/scene";
import { Axis, Quaternion, Vector3 } from "@babylonjs/core/Maths/math";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { AbstractEngine, ActionManager, AnimationPropertiesOverride, ArcRotateCamera, Engine, ExecuteCodeAction, FreeCamera, HavokPlugin, ISceneLoaderAsyncResult, MeshBuilder, PhysicsBody, PhysicsMotionType, PhysicsShapeBox, PhysicsShapeCylinder, SceneLoader, UniversalCamera, WebGPUEngine } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { IBabylonCanvas } from "@/components/babylon-canvas/babylon-canvas.interface";
import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";
import HavokPhysics from "@babylonjs/havok";
// import "@babylonjs/core/Physics/physicsEngineComponent";
// import '@babylonjs/core/Engines/WebGPU/Extensions';
import anime from 'animejs/lib/anime.es.js';

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

    const camera = new ArcRotateCamera("camera1", Math.PI / 2, -Math.PI / 2.7, 8, new Vector3(5, 1.2, 0), scene);
    cameraRef.current = camera;
    // const camera = new FreeCamera("camera1", new Vector3(0, 5, 10), scene);
    // camera.setTarget(new Vector3(0, 0, -5));
    camera.attachControl(canvas, true);
    camera.lowerRadiusLimit = 5; // 캐릭터와 카메라 간의 최소 거리 (이 값보다 더 가까워 지지 않음)
    // camera.inputs.removeByType("UniversalCameraKeyboardMoveInput");
    // camera.inputs.clear();
    // camera.inputs.addMouse(true);
    // camera.inputs.addMouseWheel();
    // camera.inputs.remove

    const gravityVector = new Vector3(0, -9.81, 0);
    const havokInstance = await HavokPhysics();
    const physicsPlugin = new HavokPlugin(undefined, havokInstance);
    scene.enablePhysics(gravityVector, physicsPlugin);

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    // light.setDirectionToTarget(new Vector3(0, 0, 0));

    // const shadowGenerator = new ShadowGenerator(1024, light);
    // shadowGenerator.darkness = 0.4;

    const ground = MeshBuilder.CreateGround("ground1", { width: 40, height: 40 });
    ground.position.y = 0;
    ground.receiveShadows = true;

    // 캐릭터와 맵핑할 메쉬
    const box = MeshBuilder.CreateBox("box", { size: 1 }, scene);
    box.position.y = 1.2;
    box.position.x = 5;
    box.rotationQuaternion = Quaternion.Identity();
    box.visibility = 0;
    // box.rotate(Vector3.Up(), -Math.PI / 2);
    camera.setTarget(box);

    const boxBody = new PhysicsBody(box, PhysicsMotionType.DYNAMIC, false, scene);
    boxBody.shape = new PhysicsShapeCylinder(
      new Vector3(0, -0.5, 0),
      new Vector3(0, 2, 0),
      0.9,
      scene
    );
    boxBody.setMassProperties({ mass: 1 });
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
    fixedBox.visibility = 0;

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

      result.meshes.forEach(o => {
        o.parent = box;
        o.scaling.scaleInPlace(0.01);
        // o.rotate(Vector3.Up(), Math.PI);
        o.rotation.x = Math.PI / 2;
        o.rotation.y = Math.PI;
        // o.rotation.x = Math.PI;
        o.position.y = -0.5;

        camera.setTarget(o);
      });
      // const root = result.meshes.find(p => p.id === "__root__");
      // root!.parent = box;
      // root!.scaling.scaleInPlace(0.01);
      // root!.rotate(Vector3.Up(), Math.PI);
      // // root!.rotation.x = Math.PI;
      // root!.position.y = -0.5;

      const walkingAnim = result.animationGroups.find(k => k.name === 'walking');
      const idleAnim = result.animationGroups.find(k => k.name === 'idle');
      const jumpAnim = result.animationGroups.find(k => k.name === 'jump');

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
        const forward = new Vector3(direction.normalize().x, 0, direction.normalize().z)
        const rot = Quaternion.FromLookDirectionLH(forward, Vector3.Up())
        const euler = rot.toEulerAngles();
        let keydown = false;
        if (inputMap['w'] && !inputMap['d'] && !inputMap['a']) {
          euler.y = euler.y;
        }
        if (inputMap['s'] && !inputMap['d'] && !inputMap['a']) {
          euler.y = euler.y + angle180;
        }
        if (inputMap['a'] && !inputMap['w'] && !inputMap['s']) {
          euler.y = euler.y - angle90;
        }
        if (inputMap['d'] && !inputMap['w'] && !inputMap['s']) {
          euler.y = euler.y + angle90;
        }
        if (inputMap['w'] && inputMap['d']) {
          euler.y = euler.y + angle45;
        }
        if (inputMap['w'] && inputMap['a']) {
          euler.y = euler.y - angle45;
        }
        if (inputMap['s'] && inputMap['d']) {
          euler.y = euler.y + angle135;
        }
        if (inputMap['s'] && inputMap['a']) {
          euler.y = euler.y - angle135;
        }
        if (inputMap['w'] || inputMap['s'] || inputMap['a'] || inputMap['d']) {
          keydown = true;
          const quaternion = euler.toQuaternion();
          Quaternion.SlerpToRef(
            box.rotationQuaternion!,
            quaternion,
            0.1,
            box.rotationQuaternion!
          );
          box.translate(new Vector3(0, 0, -1), 0.08);
          boxBody.setTargetTransform(box.absolutePosition, box.rotationQuaternion!);
        }
        if (keydown) {
          if (!animating) {
            animating = true;
            walkingAnim!.start(true, 1.0, walkingAnim!.from, walkingAnim!.to, true);
          }
        } else {
          if (animating) {
            idleAnim!.start(true, 1.0, idleAnim!.from, idleAnim!.to, true);
            walkingAnim!.stop();
            animating = false;
          }
        }
      });
      // setTimeout(() => {
      //   result.animationGroups.at(2)?.start(true);
      // }, 2000);

      // setTimeout(() => {
      //   result.animationGroups.at(1)?.start(true);
      // }, 3000);

      // result.meshes.forEach(x => {
      //   x.position.x = 0;
      //   x.position.y = 0;
      //   x.position.z = 0;
      //   // x.rotate(new Vector3(0, 0, 0), 10);
      //   // x.rotation.z = Math.PI;
      // });
    });

    engine.runRenderLoop(() => {
      scene.render();
      // camera.setTarget(box);
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