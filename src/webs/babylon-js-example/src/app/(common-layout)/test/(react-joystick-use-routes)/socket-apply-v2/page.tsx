"use client"

import { useEffect, useRef, useState } from "react";
import { Scene } from "@babylonjs/core/scene";
import { Color3, Quaternion, Vector3 } from "@babylonjs/core/Maths/math";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { AbstractMesh, ActionManager, ArcRotateCamera, DirectionalLight, HavokPlugin, MeshBuilder, PhysicsBody, PhysicsMotionType, PhysicsShapeBox, PhysicsShapeCylinder, ReflectiveShadowMap, ShadowGenerator, SpotLight, StandardMaterial } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import HavokPhysics from "@babylonjs/havok";
import { Joystick } from "@wisdomstar94/react-joystick";
import { BabylonCanvas, IBabylonCanvas, useBabylonCharacterController, useBabylonMeshPhysicsManager, IUseBabylonCharacterController, calculateDistance3D } from "@wisdomstar94/react-babylon-utils";
import { useKeyboardManager } from "@wisdomstar94/react-keyboard-manager";
import { TouchContainer } from "@wisdomstar94/react-touch-container";
import { useSocketioManager } from "@wisdomstar94/react-socketio-manager";
import { useBody } from "@wisdomstar94/react-body";
import { usePromiseInterval } from "@wisdomstar94/react-promise-interval";
import { usePromiseTimeout } from "@wisdomstar94/react-promise-timeout";
import { useAuthCheck } from "@/hooks/use-auth-check/use-auth-check.hook";

export default function Page() {
  const sceneRef = useRef<Scene>();
  const [groundWidth, setGroundWidth] = useState(40);
  const [groundHeight, setGroundHeight] = useState(40);
  const body = useBody();
  const authCheck = useAuthCheck();
  const characterId = authCheck.payload?.characterId ?? '';

  const babylonMeshPhysicsManager = useBabylonMeshPhysicsManager();

  const babylonCharacterController = useBabylonCharacterController({
    thisClientCharacterOptions: {
      characterId,
      nearDistance: 1.4,
    },
    debugOptions: {
      isShowCharacterParentBoxMesh: false,
    },
    onAdded(characterItem) {
      if ((window as any).character === undefined) {
        (window as any).character = {};
      }
      (window as any).character[characterItem.characterId] = characterItem;
      (window as any).babylonCharacterController = babylonCharacterController;
    },
  });
  babylonCharacterController.setThisClientCharacterId(characterId);

  const socketioManager = useSocketioManager({
    isAutoConnect: false,
    socketUrl: process.env.NEXT_PUBLIC_WEBS_BABYLON_JS_EXAMPLE_SOCKET_CONNECT_URL ?? (() => { throw new Error(`NEXT_PUBLIC_WEBS_BABYLON_JS_EXAMPLE_SOCKET_CONNECT_URL 값이 없습니다.`) })(),
    listeners: [
      {
        eventName: 'otherUserConnect', 
        callback(data: IUseBabylonCharacterController.AddRequireInfo) {
          if (data.characterId === characterId) return;
          
          if (babylonCharacterController.getCharacter(data.characterId) === undefined) {
            babylonCharacterController.add({ 
              ...data, 
              scene: sceneRef.current!, 
              chracterPhysicsBodyOptions: {
                angularDamping: 100,
                linearDamping: 10,
              },
            });
          }

          const meCharacter = babylonCharacterController.getCharacter(characterId);
          if (meCharacter !== undefined) {
            const d: Omit<IUseBabylonCharacterController.AddRequireInfo, 'scene'> = {
              characterAnimationGroupNames: meCharacter.characterAnimationGroupNames,
              characterId: meCharacter.characterId,
              characterNickName: authCheck.payload?.characterNickName,
              characterInitPosition: { x: meCharacter.characterBox.position.x, y: meCharacter.characterBox.position.y, z: meCharacter.characterBox.position.z },
              characterJumpingOptions: meCharacter.jumpingOptions,
              characterSize: meCharacter.characterSize,
              glbFileUrl: meCharacter.glbFileUrl,
            };
            socketioManager.emit({
              eventName: "meCurrent", 
              data: { data: d, characterId: data.characterId },
            });
          }
        },
      },
      {
        eventName: 'otherUserDisconnect',
        callback(data) {
          console.log('@@otherUserDisconnect', data);
          const { characterId } = data;
          babylonCharacterController.remove(characterId);
        },
      },
      {
        eventName: 'otherUserCurrent',
        callback(data: IUseBabylonCharacterController.AddRequireInfo) {
          console.log('@otherUserCurrent', data);
          if (data.characterId === characterId) return;
          babylonCharacterController.add({ 
            ...data, 
            scene: sceneRef.current!, 
            chracterPhysicsBodyOptions: { 
              angularDamping: 100,
              linearDamping: 10,
            },
          });
          
          const meCharacter = babylonCharacterController.getCharacter(characterId);
          if (meCharacter !== undefined) {
            const data: Omit<IUseBabylonCharacterController.AddRequireInfo, 'scene'> = {
              characterAnimationGroupNames: meCharacter.characterAnimationGroupNames,
              characterId: meCharacter.characterId,
              characterInitPosition: { x: meCharacter.characterBox.position.x, y: meCharacter.characterBox.position.y, z: meCharacter.characterBox.position.z },
              characterJumpingOptions: meCharacter.jumpingOptions,
              characterSize: meCharacter.characterSize,
              glbFileUrl: meCharacter.glbFileUrl,
            };
            socketioManager.emit({
              eventName: "meCurrent", 
              data: { data, characterId: data.characterId },
            });
          }
        },
      },
      {
        eventName: 'otherUserCurrentPositionAndRotation',
        callback(data: IUseBabylonCharacterController.CharacterPositionAndRotationOptions) {
          console.log('@otherUserCurrentPositionAndRotation', data);
          if (data.characterId === characterId) return;
          const c = babylonCharacterController.getCharacter(data.characterId);
          if (c === undefined) return;
          babylonCharacterController.setCharacterPositionAndRotation({
            ...data,
            // notApplyPositionWhenNotBigDiffrenceOptions: data.notApplyPositionWhenNotBigDiffrenceOptions ?? {
            //   isNotApplyPositionWhenNotBigDiffrence: true,
            //   bigDifferenceDistance: 0,
            // },
          });
        },
      },
      {
        eventName: 'otherUserModelMovingInfo', 
        callback(data: IUseBabylonCharacterController.CharacterMovingOptions) {
          if (data.characterId === characterId) return;
          // ...
          babylonCharacterController.setCharacterMoving(data);
        },
      },
      {
        eventName: 'otherUserModelJumpingInfo', 
        callback(data: { characterId: string; jumpingOptions: IUseBabylonCharacterController.CharacterJumpingOptions }) {
          if (data.characterId === characterId) return;
          // ...
          babylonCharacterController.setCharacterJumping(data.characterId, data.jumpingOptions);
        },
      },
    ],
  });

  const emitMeCurrentPositionAndRotationInterval = usePromiseInterval({
    fn: async() => {
      emitMeCurrentPositionAndRotation();
      return;
    },
    intervalTime: 1000,
    isAutoStart: false,
    isCallWhenStarted: true,
    isForceCallWhenFnExecuting: true,
  });

  const emitInitMeCurrentPositionAndRotationInterval = usePromiseInterval({
    fn: async() => {
      emitMeCurrentPositionAndRotation();
      return;
    },
    intervalTime: 500,
    callMaxCount: 4,
    isAutoStart: false,
    isCallWhenStarted: true,
    isForceCallWhenFnExecuting: true,
  });

  const emitMeCurrentPositionAndRotationTimeout = usePromiseTimeout({
    fn: async() => {
      emitMeCurrentPositionAndRotation({ isForce: true });
    },
    timeoutTime: 500,
    isAutoStart: false,
    isCallWhenStarted: false,
    isForceCallWhenFnExecuting: true,
  });

  function emitMeCurrentPositionAndRotation(params?: { isForce?: boolean; }) {
    const { isForce } = params ?? {};

    const c = babylonCharacterController.getCharacter(characterId);
    if (c !== undefined) {
      const firstMesh: AbstractMesh | undefined = c.characterMeshes[0];
      const ro = firstMesh?.rotationQuaternion;
      const data: IUseBabylonCharacterController.CharacterPositionAndRotationOptions = {
        characterId,
        position: { x: c.characterBox.position.x, y: c.characterBox.position.y, z: c.characterBox.position.z },
        rotation: ro !== undefined && ro !== null ? { x: ro.x, y: ro.y, z: ro.z, w: ro.w } : undefined,
        // notApplyPositionWhenNotBigDiffrenceOptions: isForce === true ? {
        //   isNotApplyPositionWhenNotBigDiffrence: false,
        // } : undefined,
        // animateOptions: isForce === true ? {
        //   isAnimate: true,
        //   duration: 500,
        // } : undefined,
      };
      console.log('@meCurrentPositionAndRotation');
      socketioManager.emit({
        eventName: "meCurrentPositionAndRotation", 
        data,
      });
    }
  }

  function disposeMoving(params: { 
    direction: IUseBabylonCharacterController.CharacterGoDirection | undefined;
    isRunning: boolean;
    // cameraDirection?: Vector3;
  }) {
    const {
      direction,
      isRunning,
      // cameraDirection,
    } = params;

    const c = babylonCharacterController.getCharacter(characterId);
    if (c === undefined) return;

    const cDirection = c?.camera?.getForwardRay().direction;
    const movingInfo: IUseBabylonCharacterController.CharacterMovingOptions = { characterId, direction, isRunning: isRunning, cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined };
    socketioManager.emit({ eventName: 'meMoving', data: movingInfo, prevent(prevData) {
        if (prevData?.direction === direction && prevData?.isRunning === movingInfo.isRunning) return true;
        return false;
      },
    });
    babylonCharacterController.setCharacterMoving({ characterId, direction, isRunning });
  }

  function disposeJumping() {
    const c = babylonCharacterController.getCharacter(characterId);
    if (c === undefined) return;

    if (c !== undefined && c.isJumpPossible !== false) {
      socketioManager.emit({
        eventName: 'meJumping', 
        data: { characterId, jumpingOptions: c.jumpingOptions },
        prevent() {
          return c.isJumpPossible === false;
        },
      });
      babylonCharacterController.setCharacterJumping(characterId);
    }
  }

  useKeyboardManager({
    onChangeKeyMapStatus(keyMap) {
      const isUpPress = keyMap.get('ArrowUp');
      const isDownPress = keyMap.get('ArrowDown');
      const isLeftPress = keyMap.get('ArrowLeft');
      const isRightPress = keyMap.get('ArrowRight');
      const isShiftPress = keyMap.get('Shift');
      const isJumpPress = keyMap.get(' ');
      if (isUpPress && !isDownPress && !isLeftPress && !isRightPress) { disposeMoving({ direction: 'Up', isRunning: isShiftPress ?? false }); }
      if (!isUpPress && isDownPress && !isLeftPress && !isRightPress) { disposeMoving({ direction: 'Down', isRunning: isShiftPress ?? false }); }
      if (!isUpPress && !isDownPress && isLeftPress && !isRightPress) { disposeMoving({ direction: 'Left', isRunning: isShiftPress ?? false }); }
      if (!isUpPress && !isDownPress && !isLeftPress && isRightPress) { disposeMoving({ direction: 'Right', isRunning: isShiftPress ?? false }); }
      if (isUpPress && !isDownPress && isLeftPress && !isRightPress) { disposeMoving({ direction: 'Up+Left', isRunning: isShiftPress ?? false }); }
      if (isUpPress && !isDownPress && !isLeftPress && isRightPress) { disposeMoving({ direction: 'Up+Right', isRunning: isShiftPress ?? false }); }
      if (!isUpPress && isDownPress && isLeftPress && !isRightPress) { disposeMoving({ direction: 'Down+Left', isRunning: isShiftPress ?? false }); }
      if (!isUpPress && isDownPress && !isLeftPress && isRightPress) { disposeMoving({ direction: 'Down+Right', isRunning: isShiftPress ?? false }); }
      if (!isUpPress && !isDownPress && !isLeftPress && !isRightPress) { disposeMoving({ direction: undefined, isRunning: isShiftPress ?? false }); }
      if (isJumpPress) { disposeJumping(); }
    },
  });

  async function onReady(initInfo: IBabylonCanvas.InitInfo) {
    const {
      engines, 
      scene,
      canvas,
      axesViewer,
    } = initInfo;

    canvas.focus();

    sceneRef.current = scene;
    scene.actionManager = new ActionManager(scene);

    const gravityVector = new Vector3(0, -19.81, 0);
    const havokInstance = await HavokPhysics();
    const physicsPlugin = new HavokPlugin(undefined, havokInstance);
    scene.enablePhysics(gravityVector, physicsPlugin);
    scene.shadowsEnabled = true;

    const light2 = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light2.intensity = 0.2;

    // const light = new SpotLight("spot-light", new Vector3(30, 40, -30), new Vector3(-10, -10, 10), -Math.PI * 0.1, 1, scene);
    // light.intensity = 0.7;
    // light.diffuse = new Color3(1, 1, 1);
    // light.shadowEnabled = true;
    // light.shadowMinZ = 15;
    // light.shadowMaxZ = 40; 

    const light = new DirectionalLight("dirLight", new Vector3(0, -1, 1), scene);
    light.position.z = -22;
    light.position.x = 22;
    light.position.y = 20;
    // light.radius = 10;
    // light.range = 1;
    light.intensity = 0.7;
    // light.autoUpdateExtends = false;
    light.shadowMinZ = 10;
    light.shadowMaxZ = 450;
    light.setDirectionToTarget(new Vector3(-1, 0, 1));
    // light.setDirectionToTarget(new Vector3(-10, 0, -10));
    
    // light.orthoLeft = -0.15;
    // light.orthoRight = 0.20;
    // light.orthoBottom = -0.15;
    // light.orthoTop = 0.40;

    // const rsm = new ReflectiveShadowMap(scene, light, { width: 512, height: 512 });

    const camera = new ArcRotateCamera("camera1", Math.PI / 2, -Math.PI / 2.5, 10, Vector3.Zero(), scene);
    // camera.attachControl(canvas, true);

    const shadowGenerator = new ShadowGenerator(4096, light, undefined, camera);
    shadowGenerator.bias = 0.0003;
    // shadowGenerator.useKernelBlur = true;
    // shadowGenerator.useContactHardeningShadow = true;
    // shadowGenerator.usePoissonSampling = true;
    // shadowGenerator.useExponentialShadowMap = true;
    // shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_MEDIUM;
    // shadowGenerator.useContactHardeningShadow = true;
    // shadowGenerator.contactHardeningLightSizeUVRatio = 0.015;

    const settingShadow = (mesh: AbstractMesh, receiveShadows: boolean) => {
      mesh.receiveShadows = receiveShadows;
      const shadowMap = shadowGenerator.getShadowMap();
      // console.log('@@shadowMap', shadowMap);
      shadowMap?.renderList?.push(mesh);
      // shadowGenerator.addShadowCaster(mesh, true);
      // rsm.addMesh(mesh);
    };

    // 바닥 셋팅
    babylonMeshPhysicsManager.injectObject({
      manageName: 'ground',
      mesh: (params) => {
        const { manageName } = params;
        // const mesh = MeshBuilder.CreateGround(manageName, { width: groundWidth, height: groundHeight }, scene);
        const mesh = MeshBuilder.CreateBox(manageName, { width: groundWidth, height: 0.1, depth: groundHeight }, scene);
        mesh.position.y = 0;

        const groundMaterial = new StandardMaterial("ground", scene);
        // groundMaterial.ambientColor = new Color3(1, 1, 1);
        groundMaterial.specularColor = new Color3(0, 0, 0);
        groundMaterial.emissiveColor = new Color3(0.2, 0.2, 0.2);
        groundMaterial.useLightmapAsShadowmap = true;
        mesh.material = groundMaterial;

        settingShadow(mesh, true);
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

    // 가운데 고정 박스 셋팅
    babylonMeshPhysicsManager.injectObject({
      manageName: 'center-box',
      mesh: (params) => {
        const { manageName } = params;
        const mesh = MeshBuilder.CreateBox(manageName, { width: 2, height: 2, depth: 2 }, scene); // width == x, height == y, depth == z 
        mesh.position.y = 1.2;
        mesh.position.x = 0;
        mesh.position.z = 0;
        settingShadow(mesh, true);
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

    // 가운데 고정 박스 셋팅
    babylonMeshPhysicsManager.injectObject({
      manageName: 'center-box2',
      mesh: (params) => {
        const { manageName } = params;
        const mesh = MeshBuilder.CreateBox(manageName, { width: 1.5, height: 1.5, depth: 1.5 }, scene); // width == x, height == y, depth == z 
        mesh.position.y = 1.2;
        mesh.position.x = 2;
        mesh.position.z = -2;
        settingShadow(mesh, true);
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

    // 원뿔 고정 박스 셋팅
    // babylonMeshPhysicsManager.injectObject({
    //   manageName: 'cone-box',
    //   mesh: (params) => {
    //     const { manageName } = params;
    //     const mesh = MeshBuilder.CreateCylinder(manageName, {
    //       diameterTop: 0,
    //       diameter: 5,
    //     }, scene); // width == x, height == y, depth == z 
    //     mesh.position.y = 2.2;
    //     mesh.position.x = 0;
    //     mesh.position.z = 0;
    //     return mesh;
    //   },
    //   physicsBody: (params) => {
    //     const { mesh } = params;
    //     const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
    //     body.shape = new PhysicsShapeBox(
    //       new Vector3(0, 0, 0),
    //       Quaternion.Identity(),
    //       new Vector3(2, 2, 2),
    //       scene,
    //     );
    //     body.shape = new PhysicsShapeCylinder()
    //     body.setMassProperties({ mass: 0 });
    //     return body;
    //   },
    // });

    // 왼쪽 벽 셋팅
    babylonMeshPhysicsManager.injectObject({
      manageName: 'left-wall',
      mesh: (params) => {
        const { manageName } = params;
        const mesh = MeshBuilder.CreateBox(manageName, { width: 0.5, height: 5, depth: 40 }, scene); // width == x, height == y, depth == z 
        mesh.position.y = 2.5;
        mesh.position.x = -20;
        mesh.position.z = 0;
        mesh.visibility = 1;
        settingShadow(mesh, true);
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

    // 캐릭터 셋팅
    babylonCharacterController.add({
      camera,
      scene,
      characterInitPosition: { x: 5, y: 1, z: 0 },
      characterSize: { x: 0.5, y: 1.5, z: 0.5 },
      characterId,
      characterNickName: authCheck.payload?.characterNickName,
      characterAnimationGroupNames: {
        idleAnimationGroupName: 'idle',
        walkingAnimationGroupName: 'walking',
        jumpingAnimationGroupName: 'jumping',
        runningAnimationGroupName: 'running',
      },
      characterJumpingOptions: {
        jumpingAnimationStartDelay: 450,
        jumpingAnimationDuration: 400,
        jumpingTotalDuration: 1400,
      },
      glbFileUrl: {
        baseUrl: '/models/',
        filename: 'casual-lowpoly-male.glb',
      },
      chracterPhysicsBodyOptions: {
        angularDamping: 100,
        linearDamping: 10,
      },
    }).then((c) => {
      c?.characterMeshes.forEach((mesh, index) => {
        settingShadow(mesh, true);  
      });

    });
  }

  useEffect(() => {
    (window as any).calculateDistance3D = calculateDistance3D;
  }, []);

  useEffect(() => {
    if (!babylonCharacterController.isThisClientCharacterLoaded) return;
    console.log('@tt');
    socketioManager.connect({ authToken: authCheck.accessToken ?? '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [babylonCharacterController.isThisClientCharacterLoaded]);

  useEffect(() => {
    if (!socketioManager.isConnected) {
      return;
    }

    const meCharacter = babylonCharacterController.getCharacter(characterId);
    if (meCharacter !== undefined) {
      const data: Omit<IUseBabylonCharacterController.AddRequireInfo, 'scene'> = {
        characterAnimationGroupNames: meCharacter.characterAnimationGroupNames,
        characterId: meCharacter.characterId,
        characterNickName: authCheck.payload?.characterNickName,
        characterInitPosition: { x: meCharacter.characterBox.position.x, y: meCharacter.characterBox.position.y, z: meCharacter.characterBox.position.z },
        characterJumpingOptions: meCharacter.jumpingOptions,
        characterSize: meCharacter.characterSize,
        glbFileUrl: meCharacter.glbFileUrl,
      };
      socketioManager.emit({
        eventName: "meConnect", 
        data,
      });
    }

    emitInitMeCurrentPositionAndRotationInterval.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketioManager.isConnected]);

  useEffect(() => {
    if (babylonCharacterController.isThisClientCharacterControlling || babylonCharacterController.isExistThisClientCharacterNearOtherCharacters) {
      emitMeCurrentPositionAndRotationInterval.stop();
      emitMeCurrentPositionAndRotationInterval.start({ intervalTime: babylonCharacterController.isExistThisClientCharacterNearOtherCharacters ? 250 : 1000 });
    } else {
      emitMeCurrentPositionAndRotationInterval.stop();
      emitMeCurrentPositionAndRotationTimeout.start();
      emitMeCurrentPositionAndRotationInterval.fnCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [babylonCharacterController.isThisClientCharacterControlling, babylonCharacterController.isExistThisClientCharacterNearOtherCharacters])

  useEffect(() => {
    body.denyScroll();
    body.denyTextDrag();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authCheck.accessToken === undefined) {
    return <>Loading..</>;
  }

  if (authCheck.accessToken === null) {
    return <>Require Login..</>;
  }

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
      <div className="fixed bottom-10 right-10 z-10">
        <Joystick
          onPressed={(keys, isStrenth) => {
            if (keys.includes('ArrowUp') && !keys.includes('ArrowLeft') && !keys.includes('ArrowRight')) { disposeMoving({ direction: 'Up', isRunning: isStrenth }); } // ⬆
            if (keys.includes('ArrowDown') && !keys.includes('ArrowLeft') && !keys.includes('ArrowRight')) { disposeMoving({ direction: 'Down', isRunning: isStrenth }); } // ⬇
            if (keys.includes('ArrowLeft') && !keys.includes('ArrowUp') && !keys.includes('ArrowDown')) { disposeMoving({ direction: 'Left', isRunning: isStrenth }); } // ⬅
            if (keys.includes('ArrowRight') && !keys.includes('ArrowUp') && !keys.includes('ArrowDown')) { disposeMoving({ direction: 'Right', isRunning: isStrenth }); } // ⮕
            if (keys.includes('ArrowUp') && keys.includes('ArrowLeft')) { disposeMoving({ direction: 'Up+Left', isRunning: isStrenth }); } // ⬅ + ⬆
            if (keys.includes('ArrowUp') && keys.includes('ArrowRight')) { disposeMoving({ direction: 'Up+Right', isRunning: isStrenth }); } // ⬆ + ⮕
            if (keys.includes('ArrowDown') && keys.includes('ArrowLeft')) { disposeMoving({ direction: 'Down+Left', isRunning: isStrenth }); } // ⬅ + ⬇
            if (keys.includes('ArrowDown') && keys.includes('ArrowRight')) { disposeMoving({ direction: 'Down+Right', isRunning: isStrenth }); } // ⬇ + ⮕
          }}
          onPressOut={() => {
            disposeMoving({ direction: undefined, isRunning: false });
          }}
          />
      </div>
      <div className="fixed bottom-10 left-10 z-10">
        <TouchContainer
          className="w-[100px] h-[100px] bg-red-500/50 hover:bg-red-500/70 rounded-full"
          onTouchStart={() => { 
            disposeJumping();
          }}
          />
      </div>
      <div className="fixed top-2 left-2 bg-black/80 px-3 py-1.5 text-xs text-white">
        { characterId } { emitInitMeCurrentPositionAndRotationInterval.isIntervalExecuting ? 'true' : 'false' }
      </div>
    </>
  );
}