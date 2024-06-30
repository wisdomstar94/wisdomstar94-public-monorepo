"use client"

import { useEffect, useRef, useState } from "react";
import { Scene } from "@babylonjs/core/scene";
import { Matrix, Quaternion, Vector3 } from "@babylonjs/core/Maths/math";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { ActionManager, ArcRotateCamera, GroundMesh, HavokPlugin, MeshBuilder, PhysicsBody, PhysicsMotionType, PhysicsShapeBox } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import HavokPhysics from "@babylonjs/havok";
import { Joystick } from "@wisdomstar94/react-joystick";
import { BabylonCanvas, IBabylonCanvas, useBabylonCharacterController, useBabylonMeshPhysicsManager } from "@wisdomstar94/react-babylon-utils";
import { useKeyboardManager } from "@wisdomstar94/react-keyboard-manager";
import { TouchContainer } from "@wisdomstar94/react-touch-container";

export default function Page() {
  const sceneRef = useRef<Scene>();
  const [groundWidth, setGroundWidth] = useState(40);
  const [groundHeight, setGroundHeight] = useState(40);

  const babylonMeshPhysicsManager = useBabylonMeshPhysicsManager();

  const babylonCharacterController = useBabylonCharacterController({
    debugOptions: {
      isShowCharacterParentBoxMesh: false,
    },
    onLoaded(info) {
      console.log('info.characterAnimationGroups', info.characterAnimationGroups);
    },
    animationGroupNames: {
      idleAnimationGroupName: 'idle',
      walkingAnimationGroupName: 'walking',
      jumpingAnimationGroupName: 'jump',
      runningAnimationGroupName: 'running',
    },
  });

  useKeyboardManager({
    onChangeKeyMapStatus(keyMap) {
      console.log('keyMap', keyMap);
      const isUpPress = keyMap.get('ArrowUp');
      const isDownPress = keyMap.get('ArrowDown');
      const isLeftPress = keyMap.get('ArrowLeft');
      const isRightPress = keyMap.get('ArrowRight');
      const isShiftPress = keyMap.get('Shift');
      const isJumpPress = keyMap.get(' ');
      if (isUpPress && !isDownPress && !isLeftPress && !isRightPress) babylonCharacterController.setCharacterMoving('Up', isShiftPress);
      if (!isUpPress && isDownPress && !isLeftPress && !isRightPress) babylonCharacterController.setCharacterMoving('Down', isShiftPress);
      if (!isUpPress && !isDownPress && isLeftPress && !isRightPress) babylonCharacterController.setCharacterMoving('Left', isShiftPress);
      if (!isUpPress && !isDownPress && !isLeftPress && isRightPress) babylonCharacterController.setCharacterMoving('Right', isShiftPress);
      if (isUpPress && !isDownPress && isLeftPress && !isRightPress) babylonCharacterController.setCharacterMoving('Up+Left', isShiftPress);
      if (isUpPress && !isDownPress && !isLeftPress && isRightPress) babylonCharacterController.setCharacterMoving('Up+Right', isShiftPress);
      if (!isUpPress && isDownPress && isLeftPress && !isRightPress) babylonCharacterController.setCharacterMoving('Down+Left', isShiftPress);
      if (!isUpPress && isDownPress && !isLeftPress && isRightPress) babylonCharacterController.setCharacterMoving('Down+Right', isShiftPress);
      if (!isUpPress && !isDownPress && !isLeftPress && !isRightPress) babylonCharacterController.setCharacterMoving(undefined);
      if (isJumpPress) babylonCharacterController.setCharacterJumping(500, 850);
    },
  });

  async function onReady(initInfo: IBabylonCanvas.InitInfo) {
    const {
      engines, 
      scene,
      canvas,
      axesViewer,
    } = initInfo;

    const engine = engines.engine;

    sceneRef.current = scene;
    scene.actionManager = new ActionManager(scene);

    const gravityVector = new Vector3(0, -11.81, 0);
    const havokInstance = await HavokPhysics();
    const physicsPlugin = new HavokPlugin(undefined, havokInstance);
    scene.enablePhysics(gravityVector, physicsPlugin);

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const camera = new ArcRotateCamera("camera1", Math.PI / 2, -Math.PI / 2.5, 10, Vector3.Zero(), scene);
    // camera.attachControl(canvas, true);

    babylonMeshPhysicsManager.injectObject({
      manageName: 'ground',
      mesh: (params) => {
        const { manageName } = params;
        const mesh = MeshBuilder.CreateGround(manageName, { width: groundWidth, height: groundHeight });
        mesh.position.y = 0;
        mesh.receiveShadows = true;
        return mesh;
      },
      physicsBody: (params) => {
        const { mesh } = params;
        const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
        body.shape = new PhysicsShapeBox(
          new Vector3(0, 0, 0),
          Quaternion.Identity(),
          new Vector3(groundWidth, 0.1, groundHeight),
          scene,
        );
        body.setMassProperties({ mass: 0 });
        return body;
      },
    });

    babylonMeshPhysicsManager.injectObject({
      manageName: 'center-box',
      mesh: (params) => {
        const { manageName } = params;
        const mesh = MeshBuilder.CreateBox(manageName, { width: 2, height: 2, depth: 2 }, scene); // width == x, height == y, depth == z 
        mesh.position.y = 2.2;
        mesh.position.x = 0;
        mesh.position.z = 0;
        return mesh;
      },
      physicsBody: (params) => {
        const { mesh } = params;
        const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
        body.shape = new PhysicsShapeBox(
          new Vector3(0, 0, 0),
          Quaternion.Identity(),
          new Vector3(2, 2, 2),
          scene,
        );
        body.setMassProperties({ mass: 0 });
        return body;
      },
    });

    babylonMeshPhysicsManager.injectObject({
      manageName: 'left-wall',
      mesh: (params) => {
        const { manageName } = params;
        const mesh = MeshBuilder.CreateBox(manageName, { width: 0.5, height: 5, depth: 40 }, scene); // width == x, height == y, depth == z 
        mesh.position.y = 2.5;
        mesh.position.x = -20;
        mesh.position.z = 0;
        mesh.visibility = 1;
        return mesh;
      },
      physicsBody: (params) => {
        const { mesh } = params;
        const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
        body.shape = new PhysicsShapeBox(
          new Vector3(0, 0, 0),
          Quaternion.Identity(),
          new Vector3(0.5, 5, 40),
          scene,
        );
        body.setMassProperties({ mass: 0 });
        return body;
      },
    });

    babylonCharacterController.init({
      camera,
      scene,
      characterInitPosition: { x: 5, y: 1, z: 0 },
      characterSize: { x: 0.5, y: 1, z: 0.5 },
      glbFileUrl: {
        baseUrl: '/models/',
        filename: 'untitled.glb',
      },
    });
  }

  useEffect(() => {
    const scene = sceneRef.current;
    const groundMesh = babylonMeshPhysicsManager.getObjectMesh<GroundMesh>('ground');
    const groundPhysicsBody = babylonMeshPhysicsManager.getObjectPhysicsBody('ground');

    if (scene === undefined) return;
    if (groundMesh === undefined) return;
    if (groundPhysicsBody === undefined) return;

    const matrix = Matrix.Scaling(groundWidth / 40, 1, groundHeight / 40);
    groundMesh.setPreTransformMatrix(matrix);

    groundPhysicsBody.shape = new PhysicsShapeBox(
      new Vector3(0, 0, 0),
      Quaternion.Identity(),
      new Vector3(groundWidth, 0.1, groundHeight),
      scene,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groundWidth, groundHeight]);

  return (
    <>
      <div className="w-full h-full bg-blue-200 fixed top-0 left-0">
        <BabylonCanvas 
          applyAxesViewer={{
            enable: true,
            scaleSize: 10,
            lineThicknessSize: 0.2,
          }}
          onReady={onReady} 
          />
      </div>
      <div className="w-[200px] h-[500px] flex flex-wrap items-start content-start gap-2 fixed top-[100px] right-[20px] bg-slate-700/50">
        <div className="w-full">
          ground width : <input type="number" value={groundWidth} onChange={e => setGroundWidth(Number(e.target.value))} />
        </div>
        <div className="w-full">
          ground height : <input type="number" value={groundHeight} onChange={e => setGroundHeight(Number(e.target.value))} />
        </div>
      </div>
      <div className="fixed bottom-10 right-10 z-10">
        <Joystick
          onPressed={(keys, isStrenth) => {
            if (keys.includes('ArrowUp') && !keys.includes('ArrowLeft') && !keys.includes('ArrowRight')) { babylonCharacterController.setCharacterMoving('Up', isStrenth); } // ⬆
            if (keys.includes('ArrowDown') && !keys.includes('ArrowLeft') && !keys.includes('ArrowRight')) { babylonCharacterController.setCharacterMoving('Down', isStrenth); } // ⬇
            if (keys.includes('ArrowLeft') && !keys.includes('ArrowUp') && !keys.includes('ArrowDown')) { babylonCharacterController.setCharacterMoving('Left', isStrenth); } // ⬅
            if (keys.includes('ArrowRight') && !keys.includes('ArrowUp') && !keys.includes('ArrowDown')) { babylonCharacterController.setCharacterMoving('Right', isStrenth); } // ⮕
            if (keys.includes('ArrowUp') && keys.includes('ArrowLeft')) { babylonCharacterController.setCharacterMoving('Up+Left', isStrenth); } // ⬅ + ⬆
            if (keys.includes('ArrowUp') && keys.includes('ArrowRight')) { babylonCharacterController.setCharacterMoving('Up+Right', isStrenth); } // ⬆ + ⮕
            if (keys.includes('ArrowDown') && keys.includes('ArrowLeft')) { babylonCharacterController.setCharacterMoving('Down+Left', isStrenth); } // ⬅ + ⬇
            if (keys.includes('ArrowDown') && keys.includes('ArrowRight')) { babylonCharacterController.setCharacterMoving('Down+Right', isStrenth); } // ⬇ + ⮕
          }}
          onPressOut={() => {
            babylonCharacterController.setCharacterMoving(undefined);
          }}
          />
      </div>
      <div className="fixed bottom-10 left-10 z-10">
        <TouchContainer
          className="w-[100px] h-[100px] bg-red-500/50 hover:bg-red-500/70 rounded-full"
          onTouchStart={() => { babylonCharacterController.setCharacterJumping(500, 850) }}
          />
      </div>
    </>
  );
}