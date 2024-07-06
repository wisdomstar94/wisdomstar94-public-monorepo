"use client"

import { useEffect, useId, useRef, useState } from "react";
import { Scene } from "@babylonjs/core/scene";
import { Matrix, Quaternion, Vector3 } from "@babylonjs/core/Maths/math";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { AbstractMesh, ActionManager, ArcRotateCamera, GroundMesh, HavokPlugin, MeshBuilder, PhysicsBody, PhysicsMotionType, PhysicsShapeBox } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import HavokPhysics from "@babylonjs/havok";
import { Joystick } from "@wisdomstar94/react-joystick";
import { BabylonCanvas, IBabylonCanvas, useBabylonCharacterController, useBabylonMeshPhysicsManager, IUseBabylonCharacterController } from "@wisdomstar94/react-babylon-utils";
import { useKeyboardManager } from "@wisdomstar94/react-keyboard-manager";
import { TouchContainer } from "@wisdomstar94/react-touch-container";
import { useSocketioManager } from "@wisdomstar94/react-socketio-manager";

export default function Page() {
  const characterIdRef = useRef(Date.now() + 'id');
  const characterId = characterIdRef.current;
  const sceneRef = useRef<Scene>();
  const [groundWidth, setGroundWidth] = useState(40);
  const [groundHeight, setGroundHeight] = useState(40);

  const babylonMeshPhysicsManager = useBabylonMeshPhysicsManager();

  const babylonCharacterController = useBabylonCharacterController({
    thisClientCharacterId: characterId,
    debugOptions: {
      isShowCharacterParentBoxMesh: false,
    },
    onAdded(characterItem) {
      (window as any)[characterItem.characterId] = characterItem;
      // console.log('characterItem', characterItem);  
      // if (characterItem.characterId === 'other') {
      //   setTimeout(() => {
      //     babylonCharacterController.setCharacterMoving({ characterId: 'other', direction: 'Up', cameraDirection: { x: 1.7253501797, y: -0.485642946360, z: 0.8741572676 } });
      //   }, 3000);          
      // }
    },
  });

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
                linearDamping: 50,
              },
            });
          }

          const meCharacter = babylonCharacterController.getCharacter(characterId);
          if (meCharacter !== undefined) {
            const d: Omit<IUseBabylonCharacterController.AddRequireInfo, 'scene'> = {
              characterAnimationGroupNames: meCharacter.characterAnimationGroupNames,
              characterId: meCharacter.characterId,
              characterInitPosition: { x: meCharacter.characterBox.position.x, y: meCharacter.characterBox.position.y, z: meCharacter.characterBox.position.z },
              characterJumpingDelay: meCharacter.jumpingDelay,
              characterJumpingDuration: meCharacter.jumpingDuration,
              characterSize: meCharacter.characterSize,
              glbFileUrl: meCharacter.glbFileUrl,
            };
            socketioManager.emit("meCurrent", { data: d, characterId: data.characterId });
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
              linearDamping: 100,
            },
          });
          
          const meCharacter = babylonCharacterController.getCharacter(characterId);
          if (meCharacter !== undefined) {
            const data: Omit<IUseBabylonCharacterController.AddRequireInfo, 'scene'> = {
              characterAnimationGroupNames: meCharacter.characterAnimationGroupNames,
              characterId: meCharacter.characterId,
              characterInitPosition: { x: meCharacter.characterBox.position.x, y: meCharacter.characterBox.position.y, z: meCharacter.characterBox.position.z },
              characterJumpingDelay: meCharacter.jumpingDelay,
              characterJumpingDuration: meCharacter.jumpingDuration,
              characterSize: meCharacter.characterSize,
              glbFileUrl: meCharacter.glbFileUrl,
            };
            socketioManager.emit("meCurrent", { data, characterId: data.characterId });
          }
        },
      },
      {
        eventName: 'otherUserCurrentPositionAndRotation',
        callback(data: IUseBabylonCharacterController.CharacterPositionAndRotationOptions) {
          // console.log('@otherUserCurrentPosition', data);
          if (data.characterId === characterId) return;
          const c = babylonCharacterController.getCharacter(data.characterId);
          if (c === undefined) return;
          babylonCharacterController.setCharacterPositionAndRotation(data);
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
        callback(data: { characterId: string; delay: number; duration: number; }) {
          if (data.characterId === characterId) return;
          // ...
          babylonCharacterController.setCharacterJumping(data.characterId, data.delay, data.duration);
        },
      },
    ],
  });

  useEffect(() => {
    if (socketioManager.isConnected !== true) {

      return;
    }
  }, [socketioManager.isConnected]);

  useEffect(() => {
    if (!socketioManager.isConnected) return;

    let timer = setInterval(() => {
      const c = babylonCharacterController.getCharacter(characterId);
      if (c !== undefined) {
        const firstMesh: AbstractMesh | undefined = c.characterMeshes[0];
        const ro = firstMesh?.rotationQuaternion;
        const data: IUseBabylonCharacterController.CharacterPositionAndRotationOptions = {
          characterId,
          position: { x: c.characterBox.position.x, y: c.characterBox.position.y, z: c.characterBox.position.z },
          rotation: ro !== undefined && ro !== null ? { x: ro.x, y: ro.y, z: ro.z, w: ro.w } : undefined,
        };
        socketioManager.emit("meCurrentPositionAndRotation", data);
      }
    }, 300);
    
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketioManager.isConnected]);

  useKeyboardManager({
    onChangeKeyMapStatus(keyMap) {
      // console.log('keyMap', keyMap);
      const isUpPress = keyMap.get('ArrowUp');
      const isDownPress = keyMap.get('ArrowDown');
      const isLeftPress = keyMap.get('ArrowLeft');
      const isRightPress = keyMap.get('ArrowRight');
      const isShiftPress = keyMap.get('Shift');
      const isJumpPress = keyMap.get(' ');
      const c = babylonCharacterController.getCharacter(characterId);
      const cDirection = c?.camera?.getForwardRay().direction;
      let movingInfo: IUseBabylonCharacterController.CharacterMovingOptions | undefined;
      if (isUpPress && !isDownPress && !isLeftPress && !isRightPress) { 
        movingInfo = {
          characterId,
          direction: 'Up',
          isRunning: isShiftPress,
          cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
        };
        socketioManager.emit('meMoving', movingInfo);
        babylonCharacterController.setCharacterMoving({ characterId, direction: 'Up', isRunning: isShiftPress });
      }
      if (!isUpPress && isDownPress && !isLeftPress && !isRightPress) { 
        movingInfo = {
          characterId,
          direction: 'Down',
          isRunning: isShiftPress,
          cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
        };
        socketioManager.emit('meMoving', movingInfo);
        babylonCharacterController.setCharacterMoving({ characterId, direction: 'Down', isRunning: isShiftPress });
      }
      if (!isUpPress && !isDownPress && isLeftPress && !isRightPress) { 
        movingInfo = {
          characterId,
          direction: 'Left',
          isRunning: isShiftPress,
          cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
        };
        socketioManager.emit('meMoving', movingInfo);
        babylonCharacterController.setCharacterMoving({ characterId, direction: 'Left', isRunning: isShiftPress });
      }
      if (!isUpPress && !isDownPress && !isLeftPress && isRightPress) { 
        movingInfo = {
          characterId,
          direction: 'Right',
          isRunning: isShiftPress,
          cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
        };
        socketioManager.emit('meMoving', movingInfo);
        babylonCharacterController.setCharacterMoving({ characterId, direction: 'Right', isRunning: isShiftPress });
      }
      if (isUpPress && !isDownPress && isLeftPress && !isRightPress) { 
        movingInfo = {
          characterId,
          direction: 'Up+Left',
          isRunning: isShiftPress,
          cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
        };
        socketioManager.emit('meMoving', movingInfo);
        babylonCharacterController.setCharacterMoving({ characterId, direction: 'Up+Left', isRunning: isShiftPress });
      }
      if (isUpPress && !isDownPress && !isLeftPress && isRightPress) { 
        movingInfo = {
          characterId,
          direction: 'Up+Right',
          isRunning: isShiftPress,
          cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
        };
        socketioManager.emit('meMoving', movingInfo);
        babylonCharacterController.setCharacterMoving({ characterId, direction: 'Up+Right', isRunning: isShiftPress });
      }
      if (!isUpPress && isDownPress && isLeftPress && !isRightPress) { 
        movingInfo = {
          characterId,
          direction: 'Down+Left',
          isRunning: isShiftPress,
          cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
        };
        socketioManager.emit('meMoving', movingInfo);
        babylonCharacterController.setCharacterMoving({ characterId, direction: 'Down+Left', isRunning: isShiftPress });
      }
      if (!isUpPress && isDownPress && !isLeftPress && isRightPress) { 
        movingInfo = {
          characterId,
          direction: 'Down+Right',
          isRunning: isShiftPress,
          cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
        };
        socketioManager.emit('meMoving', movingInfo);
        babylonCharacterController.setCharacterMoving({ characterId, direction: 'Down+Right', isRunning: isShiftPress });
      }
      if (!isUpPress && !isDownPress && !isLeftPress && !isRightPress) { 
        movingInfo = {
          characterId,
          direction: undefined,
          isRunning: false,
          cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
        };
        socketioManager.emit('meMoving', movingInfo);
        babylonCharacterController.setCharacterMoving({ characterId, direction: undefined });
      }
      if (isJumpPress) {
        if (c !== undefined) {
          socketioManager.emit('meJumping', { characterId, delay: c.jumpingDelay, duration: c.jumpingDuration });
        }
        babylonCharacterController.setCharacterJumping(characterId);
      }
    },
  });

  async function onReady(initInfo: IBabylonCanvas.InitInfo) {
    const {
      engines, 
      scene,
      canvas,
      axesViewer,
    } = initInfo;

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

    // 바닥 셋팅
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

    // 가운데 고정 박스 셋팅
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
      characterAnimationGroupNames: {
        idleAnimationGroupName: 'idle',
        walkingAnimationGroupName: 'walking',
        jumpingAnimationGroupName: 'jumping',
        runningAnimationGroupName: 'running',
      },
      characterJumpingDelay: 300,
      characterJumpingDuration: 500,
      glbFileUrl: {
        baseUrl: '/models/',
        filename: 'casual-lowpoly-male.glb',
      },
      chracterPhysicsBodyOptions: {
        angularDamping: 100,
        linearDamping: 10,
      },
    });
  }

  useEffect(() => {
    if (!babylonCharacterController.isThisClientCharacterLoaded) return;
    console.log('@tt');
    socketioManager.connect();
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
        characterInitPosition: { x: meCharacter.characterBox.position.x, y: meCharacter.characterBox.position.y, z: meCharacter.characterBox.position.z },
        characterJumpingDelay: meCharacter.jumpingDelay,
        characterJumpingDuration: meCharacter.jumpingDuration,
        characterSize: meCharacter.characterSize,
        glbFileUrl: meCharacter.glbFileUrl,
      };
      socketioManager.emit("meConnect", data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketioManager.isConnected]);

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
            const c = babylonCharacterController.getCharacter(characterId);
            const cDirection = c?.camera?.getForwardRay().direction;
            let movingInfo: IUseBabylonCharacterController.CharacterMovingOptions | undefined;

            if (keys.includes('ArrowUp') && !keys.includes('ArrowLeft') && !keys.includes('ArrowRight')) { 
              movingInfo = {
                characterId,
                direction: 'Up',
                isRunning: isStrenth,
                cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
              };
              socketioManager.emit('meMoving', movingInfo);
              babylonCharacterController.setCharacterMoving({ characterId, direction: 'Up', isRunning: isStrenth }); 
            } // ⬆
            if (keys.includes('ArrowDown') && !keys.includes('ArrowLeft') && !keys.includes('ArrowRight')) { 
              movingInfo = {
                characterId,
                direction: 'Down',
                isRunning: isStrenth,
                cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
              };
              socketioManager.emit('meMoving', movingInfo);
              babylonCharacterController.setCharacterMoving({ characterId, direction: 'Down', isRunning: isStrenth }); 
            } // ⬇
            if (keys.includes('ArrowLeft') && !keys.includes('ArrowUp') && !keys.includes('ArrowDown')) { 
              movingInfo = {
                characterId,
                direction: 'Left',
                isRunning: isStrenth,
                cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
              };
              socketioManager.emit('meMoving', movingInfo);
              babylonCharacterController.setCharacterMoving({ characterId, direction: 'Left', isRunning: isStrenth }); 
            } // ⬅
            if (keys.includes('ArrowRight') && !keys.includes('ArrowUp') && !keys.includes('ArrowDown')) { 
              movingInfo = {
                characterId,
                direction: 'Right',
                isRunning: isStrenth,
                cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
              };
              socketioManager.emit('meMoving', movingInfo);
              babylonCharacterController.setCharacterMoving({ characterId, direction: 'Right', isRunning: isStrenth }); 
            } // ⮕
            if (keys.includes('ArrowUp') && keys.includes('ArrowLeft')) { 
              movingInfo = {
                characterId,
                direction: 'Up+Left',
                isRunning: isStrenth,
                cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
              };
              socketioManager.emit('meMoving', movingInfo);
              babylonCharacterController.setCharacterMoving({ characterId, direction: 'Up+Left', isRunning: isStrenth }); 
            } // ⬅ + ⬆
            if (keys.includes('ArrowUp') && keys.includes('ArrowRight')) { 
              movingInfo = {
                characterId,
                direction: 'Up+Right',
                isRunning: isStrenth,
                cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
              };
              socketioManager.emit('meMoving', movingInfo);
              babylonCharacterController.setCharacterMoving({ characterId, direction: 'Up+Right', isRunning: isStrenth }); 
            } // ⬆ + ⮕
            if (keys.includes('ArrowDown') && keys.includes('ArrowLeft')) { 
              movingInfo = {
                characterId,
                direction: 'Down+Left',
                isRunning: isStrenth,
                cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
              };
              socketioManager.emit('meMoving', movingInfo);
              babylonCharacterController.setCharacterMoving({ characterId, direction: 'Down+Left', isRunning: isStrenth }); 
            } // ⬅ + ⬇
            if (keys.includes('ArrowDown') && keys.includes('ArrowRight')) { 
              movingInfo = {
                characterId,
                direction: 'Down+Right',
                isRunning: isStrenth,
                cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
              };
              socketioManager.emit('meMoving', movingInfo);
              babylonCharacterController.setCharacterMoving({ characterId, direction: 'Down+Right', isRunning: isStrenth }); 
            } // ⬇ + ⮕
          }}
          onPressOut={() => {
            const c = babylonCharacterController.getCharacter(characterId);
            const cDirection = c?.camera?.getForwardRay().direction;
            let movingInfo: IUseBabylonCharacterController.CharacterMovingOptions | undefined;
            movingInfo = {
              characterId,
              direction: undefined,
              isRunning: false,
              cameraDirection: cDirection !== undefined ? { x: cDirection.x, y: cDirection.y, z: cDirection.z } : undefined,
            };
            socketioManager.emit('meMoving', movingInfo);

            babylonCharacterController.setCharacterMoving({ characterId, direction: undefined });
          }}
          />
      </div>
      <div className="fixed bottom-10 left-10 z-10">
        <TouchContainer
          className="w-[100px] h-[100px] bg-red-500/50 hover:bg-red-500/70 rounded-full"
          onTouchStart={() => { 
            const c = babylonCharacterController.getCharacter(characterId);
            if (c !== undefined) {
              socketioManager.emit('meJumping', { characterId, delay: c.jumpingDelay, duration: c.jumpingDuration });
            }
            babylonCharacterController.setCharacterJumping(characterId);
          }}
          />
      </div>
    </>
  );
}