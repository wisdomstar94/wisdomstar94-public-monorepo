"use client"

import { useAuthCheck } from "@/hooks/use-auth-check/use-auth-check.hook";
import { AbstractMesh, ActionManager, ArcRotateCamera, Color3, DirectionalLight, DynamicTexture, HavokPlugin, HemisphericLight, MeshBuilder, PhysicsBody, PhysicsMotionType, PhysicsShapeBox, Quaternion, Scene, ShadowGenerator, StandardMaterial, Vector3 } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { BabylonCanvas, IBabylonCanvas, IUseBabylonCharacterController, useBabylonCharacterController, useBabylonMeshPhysicsManager } from "@wisdomstar94/react-babylon-utils";
import { useBody } from "@wisdomstar94/react-body";
import { useSocketioManager } from "@wisdomstar94/react-socketio-manager";
import { IUseWebRtcManager, useWebRtcManager } from "@wisdomstar94/react-web-rtc-manager";
import { useEffect, useRef, useState } from "react";
import "@babylonjs/loaders/glTF";
import { ChatData, RtcData } from "./type";
import { usePromiseInterval } from "@wisdomstar94/react-promise-interval";
import { useKeyboardManager } from "@wisdomstar94/react-keyboard-manager";
import { usePromiseTimeout } from "@wisdomstar94/react-promise-timeout";
import { Joystick } from "@wisdomstar94/react-joystick";
import { TouchContainer } from "@wisdomstar94/react-touch-container";
import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";
import { ChattingWindow } from "@/components/chatting-window/chatting-window.component";
import { IChattingWindow } from "@/components/chatting-window/chatting-window.interface";
import { AdvancedDynamicTexture, StackPanel, TextBlock } from "@babylonjs/gui";

type MetaData = {
  nickName: string;
}

const oneChannelName = 'rtc-basic-channel';

export default function Page() {
  const sceneRef = useRef<Scene>();
  const shadowGeneratorRef = useRef<ShadowGenerator>();

  const body = useBody();
  const authCheck = useAuthCheck();
  const characterId = authCheck.payload?.characterId ?? '';

  const babylonMeshPhysicsManager = useBabylonMeshPhysicsManager();
  const [meCharacterLoaded, setMeCharacterLoaded] = useState(false);

  const [isChattingWindowShow, setIsChattingWindowShow] = useState(false);
  const [isChattingInputFocus, setIsChattingInputFocus] = useState(false);

  const isCharacterControlBlock = isChattingInputFocus && isChattingWindowShow;

  const [chatItems, setChatItems] = useState<IChattingWindow.ChatItem[]>([]);
  const chatItemsSorted = (function(){
    const newArr = [...chatItems];
    newArr.sort(function (a, b) {
      return a.writedAt - b.writedAt;
    });
    return newArr;
  })();

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'keydown',
      eventListener(event) {
        const key = event.key;
        // console.log('@key', key);
        if (key.toLowerCase() === 'enter') {
          setIsChattingWindowShow(prev => true);
        }
      },
    },
  });

  const babylonCharacterController = useBabylonCharacterController({
    thisClientCharacterOptions: {
      characterId,
      nearDistance: 3,
    },
    debugOptions: {
      isShowCharacterParentBoxMesh: false,
    },
    onAdded(characterItem, scene) {
      // (window as any).babylonCharacterController = babylonCharacterController;

      // 닉네임 셋팅
      const characterNickName = characterItem.characterNickName ?? 'no named';

      const nicknameBoxSize = {
        width: 0.5 * 3, // x 축 길이
        height: 0.4, // y 축 길이
        size: 0.01, // z 축 길이
      };

      const nicknameBgBox = MeshBuilder.CreateBox('nickname-bg-box', {
        width: nicknameBoxSize.width, // x 축 길이
        height: nicknameBoxSize.height, // y 축 길이
        size: nicknameBoxSize.size, // z 축 길이
      }, scene);
  
      const nicknameBgBoxMaterial = new StandardMaterial("nickname-bg-box", scene);
      const bgBoxColor = new Color3(0, 0, 0);
      nicknameBgBoxMaterial.ambientColor = bgBoxColor;
      nicknameBgBoxMaterial.specularColor = bgBoxColor;
      nicknameBgBoxMaterial.emissiveColor = bgBoxColor;
      nicknameBgBoxMaterial.diffuseColor = bgBoxColor;
      nicknameBgBoxMaterial.useLightmapAsShadowmap = true;
      nicknameBgBoxMaterial.alpha = 0.7;
          
      nicknameBgBox.material = nicknameBgBoxMaterial;
      nicknameBgBox.parent = characterItem.characterBox;
      nicknameBgBox.visibility = 0;
  
      nicknameBgBox.position.x = 0;
      nicknameBgBox.position.y = characterItem.characterSize.y - 0.1;
      // nicknameBgBox.setPivotPoint(new Vector3(0, 5, 0));

      const nicknameTextPlane = MeshBuilder.CreatePlane('nickname-text-plane', {
        width: nicknameBoxSize.width, // x 축 길이
        height: nicknameBoxSize.height * 3.5, // y 축 길이
        // size: nicknameBoxSize.size, // z 축 길이
      }, scene);
      nicknameTextPlane.parent = nicknameBgBox;
      nicknameTextPlane.position.z = -0.1;
      nicknameTextPlane.position.y = -0.5;
      // nicknameTextPlane.setPivotPoint(new Vector3(0, -5, 0));

      const panel = new StackPanel();
      panel.verticalAlignment = 0;

      const advancedTexture = AdvancedDynamicTexture.CreateForMesh(nicknameTextPlane);
      advancedTexture.addControl(panel);

      // title
      console.log('@121212');
      const textBlock = new TextBlock();
      textBlock.text = characterNickName;
      textBlock.color = "#ffffff";
      textBlock.paddingTop = 40;
      textBlock.paddingLeft = 40;
      textBlock.paddingRight = 40;
      textBlock.fontSize = 120;
      textBlock.fontFamily = "Noto Sans KR, sans-serif";
      textBlock.height = "900px";
      textBlock.textWrapping = true;
      textBlock.fontWeight = 'bold';
      textBlock.shadowColor = 'black';
      textBlock.shadowOffsetX = 0;
      textBlock.shadowOffsetY = 0;
      textBlock.shadowBlur = 15;
      
      textBlock.textVerticalAlignment = 0;
      panel.addControl(textBlock);
    },
  });
  babylonCharacterController.setThisClientCharacterId(characterId);

  const emitInitMeCurrentPositionAndRotationInterval = usePromiseInterval({
    fn: async() => {
      console.log('@emitOpponentCurrentPositionAndRotation....');
      emitOpponentCurrentPositionAndRotation({
        // ..  
      });
    },
    intervalTime: 250,
    callMaxCount: 12,
    isAutoStart: false,
    isCallWhenStarted: true,
    isForceCallWhenFnExecuting: true,
  });

  const emitMeCurrentPositionAndRotationInterval = usePromiseInterval({
    fn: async() => {
      emitOpponentCurrentPositionAndRotation({
        // ..
      });
      return;
    },
    intervalTime: 1000,
    isAutoStart: false,
    isCallWhenStarted: true,
    isForceCallWhenFnExecuting: true,
  });

  const requestCurrentPositionAndRotationInterval = usePromiseInterval({
    fn: async() => {
      webRtcManager.emitDataChannel<RtcData>({
        channelName: oneChannelName,
        data: {
          event: 'requestConnectPositionAndRotation',
          data: null,
        },
      });
    },
    intervalTime: 500,
    isAutoStart: false,
    isCallWhenStarted: true,
    isForceCallWhenFnExecuting: true,
  });

  function emitOpponentCurrentPositionAndRotation(params: { peerConnectionInfos?: IUseWebRtcManager.RTCPeerConnectionInfo<MetaData>[] }) {
    const { peerConnectionInfos } = params;

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
      webRtcManager.emitDataChannel<RtcData>({
        channelName: oneChannelName,
        rtcPeerConnections: peerConnectionInfos,
        data: {
          event: 'opponentCurrentPositionAndRotation',
          data,
        },
      });
    }
  }

  function emitOpponentConnectInfo(params: { peerConnectionInfos?: IUseWebRtcManager.RTCPeerConnectionInfo<MetaData>[] }) {
    const { peerConnectionInfos } = params;

    const meCharacter = babylonCharacterController.getCharacter(characterId);
    if (meCharacter !== undefined) {
      const firstMesh: AbstractMesh | undefined = meCharacter.characterMeshes[0];
      const ro = firstMesh?.rotationQuaternion;

      const data: IUseBabylonCharacterController.AddRequireInfoWithoutScene = {
        characterAnimationGroupNames: meCharacter.characterAnimationGroupNames,
        characterId: meCharacter.characterId,
        characterNickName: authCheck.payload?.characterNickName,
        characterInitPosition: { x: meCharacter.characterBox.position.x, y: meCharacter.characterBox.position.y, z: meCharacter.characterBox.position.z },
        characterInitRotation: ro !== undefined && ro !== null ? { x: ro.x, y: ro.y, z: ro.z, w: ro.w } : undefined,
        characterJumpingOptions: meCharacter.jumpingOptions,
        characterSize: meCharacter.characterSize,
        glbFileUrl: meCharacter.glbFileUrl,
      };

      webRtcManager.emitDataChannel<RtcData>({
        channelName: oneChannelName,
        rtcPeerConnections: peerConnectionInfos,
        data: {
          event: 'opponentConnectInfo',
          data,
        }
      });
    }
  }

  const webRtcManager = useWebRtcManager<MetaData>({
    defaultRtcConfiguration: {
      // ...
      iceServers: [
        {
          urls: process.env.NEXT_PUBLIC_ICE_SERVER_URL ?? (() => { throw new Error(`NEXT_PUBLIC_ICE_SERVER_URL is not defined!`) })(),
          username: process.env.NEXT_PUBLIC_ICE_SERVER_USERNAME ?? (() => { throw new Error(`NEXT_PUBLIC_ICE_SERVER_USERNAME is not defined!`) })(),
          credential: process.env.NEXT_PUBLIC_ICE_SERVER_CREDENTIAL ?? (() => { throw new Error(`NEXT_PUBLIC_ICE_SERVER_CREDENTIAL is not defined!`) })(),
        }
      ]
    },
    dataChannelListeners: [
      {
        channelName: oneChannelName,
        callback(peerConnectionInfo, event) {
          const obj: RtcData = JSON.parse(event.data);
          console.log('@channel', obj);

          switch(obj.event) {
            case 'requestConnectInfo': {
              emitOpponentConnectInfo({ 
                peerConnectionInfos: [peerConnectionInfo],
              });
            } break;
            case 'requestConnectPositionAndRotation': {
              emitOpponentCurrentPositionAndRotation({
                peerConnectionInfos: [peerConnectionInfo],
              });
            } break;
            case 'opponentConnectInfo': {
              if (obj.data.characterId === characterId) return;
              
              if (babylonCharacterController.getCharacter(obj.data.characterId) === undefined) {
                babylonCharacterController.add({ 
                  ...obj.data, 
                  characterVisibilityDelay: 300,
                  scene: sceneRef.current!, 
                  chracterPhysicsBodyOptions: {
                    angularDamping: 100,
                    linearDamping: 10,
                  },
                }).then((c) => {
                  c?.characterMeshes.forEach((k) => {
                    k.receiveShadows = true;
                    const shadowMap = shadowGeneratorRef.current?.getShadowMap();
                    shadowMap?.renderList?.push(k);
                  });
                });;
              }
            } break;
            case 'opponentCurrentPositionAndRotation': {
              if (obj.data.characterId === characterId) return;
              const c = babylonCharacterController.getCharacter(obj.data.characterId);
              if (c === undefined) return;
              babylonCharacterController.setCharacterPositionAndRotation({
                ...obj.data,
              });
              
              // babylonCharacterController.getCharactersMap().forEach((character, key) => {
              //   if (character.characterId === characterId) return;
              //   character.characterBoxPhysicsBody.mass = true;
              //   setTimeout(() => {
              //     character.characterBoxPhysicsBody.disableSync = false;
              //   }, 100);
              // });
            } break;
            case 'opponentMoving': {
              if (obj.data.characterId === characterId) return;
              babylonCharacterController.setCharacterMoving(obj.data);
            } break;
            case 'opponentJumping': {
              if (obj.data.characterId === characterId) return;
              babylonCharacterController.setCharacterJumping(obj.data.characterId, obj.data.jumpingOptions);
            } break;
            case 'chatInfo': {
              const writerCharacter = babylonCharacterController.getCharacter(obj.data.writerId);
              if (writerCharacter === undefined) return;

              disposeChat(writerCharacter, {
                writer: obj.data.writer,
                writerId: obj.data.writerId,
                writedAt: obj.data.writedAt,
                content: obj.data.content,
              });
              // setChatItems(prev => {
              //   const newItems = [...prev];
              //   newItems.push({
              //     writer: obj.data.writer,
              //     writerId: obj.data.writerId,
              //     writedAt: obj.data.writedAt,
              //     content: obj.data.content,
              //   });
              //   return newItems;
              // });
            } break;
          }
        },
        // send offer 에 해당하는 peer 에서 발생하게 될 이벤트, 즉 data channel 을 생성한 peer 에서 발생하게될 이벤트
        opened(peerConnectionInfo, event) {
          webRtcManager.emitDataChannel<RtcData>({
            rtcPeerConnections: [peerConnectionInfo],
            channelName: oneChannelName,
            data: {
              event: 'requestConnectInfo',
              data: null,
            },
          });

          console.log('@opened emitInitMeCurrentPositionAndRotationInterval.start...');
          emitInitMeCurrentPositionAndRotationInterval.stop();
          emitInitMeCurrentPositionAndRotationInterval.start();
        },
        // get offer 에 해당하는 peer 에서 발생하게 될 이벤트, 즉 data channel 을 받은 peer 에서 발생하게될 이벤트
        receivedChannel(peerConnectionInfo, event) {
          console.log('@receivedChannel emitInitMeCurrentPositionAndRotationInterval.start...');
          emitInitMeCurrentPositionAndRotationInterval.stop();
          emitInitMeCurrentPositionAndRotationInterval.start();

          // 상대편에게 상대편의 connectInfo 를 요청함
          webRtcManager.emitDataChannel<RtcData>({
            rtcPeerConnections: [peerConnectionInfo],
            channelName: oneChannelName,
            data: {
              event: 'requestConnectInfo',
              data: null,
            },
          });

          // 상대편에게 나의 현재 connectInfo 정보를 전달함
          emitOpponentConnectInfo({ 
            peerConnectionInfos: [peerConnectionInfo],
          });
        },
      }
    ],
    onCreatedPeerConnectionInfo(peerConnectionInfo) {
      const {
        clientId,
        receiveId,
        rtcPeerConnection,
        meta,
      } = peerConnectionInfo;

      if (peerConnectionInfo.type === 'sendOffer') {
        rtcPeerConnection.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true }).then((sdp) => {
          rtcPeerConnection.setLocalDescription(new RTCSessionDescription(sdp));
          socketioManager.emit({
            eventName: 'sendOffer',
            data: {
              sdp,
              clientId,
              receiveId,
            },
          });
        });
      } 

      if (peerConnectionInfo.type === 'getOffer' && peerConnectionInfo.sdp !== undefined) {
        peerConnectionInfo.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(peerConnectionInfo.sdp)).then(() => {
          peerConnectionInfo.rtcPeerConnection.createAnswer({ offerToReceiveVideo: true, offerToReceiveAudio: true })
            .then(sdp => { 
              peerConnectionInfo.rtcPeerConnection.setLocalDescription(new RTCSessionDescription(sdp));
              socketioManager.emit({
                eventName: 'sendAnswer',
                data: {
                  sdp,
                  clientId: peerConnectionInfo.clientId,
                  receiveId: peerConnectionInfo.receiveId,
                },
              });
            })
            .catch(error => {
              console.error(error);
            });
        });
      }
    },
    onIceCandidate(peerConnectionInfo, event) {
      if (event.candidate) {
        let receiveId = peerConnectionInfo.clientId !== characterId ? peerConnectionInfo.clientId : peerConnectionInfo.receiveId;

        socketioManager.emit({
          eventName: 'sendCandidate',
          data: {
            candidate: event.candidate,
            clientId: characterId,
            receiveId,
          },
        });
      } 
    },
    onIceCandidateError(peerConnectionInfo, event) {
      
    },
    onIceConnectionStateChange(peerConnectionInfo, event) {
      
    },
    onIceGatheringStateChange(peerConnectionInfo, event) {
      
    },
    onNegotiationNeeded(peerConnectionInfo, event) {
      
    },
    onSignalingStateChange(peerConnectionInfo, event) {
      
    },
    onDataChannel(peerConnectionInfo, event) {
      
    },
    onConnectionStateChange(peerConnectionInfo, event) {
      switch(peerConnectionInfo.rtcPeerConnection.connectionState) {
        case 'connected': 
          break;
        case 'disconnected': 
          break;
        case 'failed': 
          babylonCharacterController.remove(peerConnectionInfo.clientId !== characterId ? peerConnectionInfo.clientId : peerConnectionInfo.receiveId);
          webRtcManager.closePeerConnection(peerConnectionInfo.clientId, peerConnectionInfo.receiveId);
          if (peerConnectionInfo.type === 'sendOffer') {
            socketioManager.emit({ eventName: 'requestOneUser', data: { targetClientId: characterId !== peerConnectionInfo.clientId ? peerConnectionInfo.clientId : peerConnectionInfo.receiveId } });
          }
          break;
      }
    },
    onClosedPeerConnectionInfo(peerConnectionInfo) {
      
    },
  });

  const socketioManager = useSocketioManager({
    listeners: [
      {
        eventName: 'allUsers',
        callback(clientIds: string[]) {
          for (const id of clientIds) {
            if (id === characterId) continue;

            webRtcManager.createPeerConnection({
              clientId: characterId,
              receiveId: id,
              type: 'sendOffer',
              meta: {
                nickName: authCheck.payload?.characterNickName ?? '',
              },
            });
          }
        },
      },
      {
        eventName: 'oneUser',
        callback(data: { clientId: string, isExist: boolean }) {
          if (data.isExist) {
            webRtcManager.createPeerConnection({
              clientId: characterId,
              receiveId: data.clientId,
              type: 'sendOffer',
              meta: {
                nickName: authCheck.payload?.characterNickName ?? '',
              },
            });
          }
        },
      },
      {
        eventName: 'getOffer',
        callback(data: { sdp: RTCSessionDescriptionInit, clientId: string, receiveId: string }) {
          webRtcManager.closePeerConnection(data.clientId, data.receiveId);
          webRtcManager.createPeerConnection({
            clientId: data.receiveId,
            receiveId: data.clientId,
            type: 'getOffer',
            sdp: data.sdp,
            meta: {
              nickName: authCheck.payload?.characterNickName ?? '',
            },
          });
        },
      },
      {
        eventName: 'getAnswer',
        callback(data: { sdp: RTCSessionDescriptionInit, clientId: string, receiveId: string }) {
          const peerConnectionInfo = webRtcManager.getPeerConnectionInfo(data.clientId, data.receiveId);
          if (peerConnectionInfo === undefined) {
            throw new Error(`peerConnectionInfo is undefined.`);
          }
          peerConnectionInfo.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp));
        },
      },
      {
        eventName: 'getCandidate',
        callback(data: { candidate: RTCIceCandidate, clientId: string, receiveId: string }) {
          const peerConnectionInfo = webRtcManager.getPeerConnectionInfo(data.clientId, data.receiveId);
          if (peerConnectionInfo === undefined) {
            throw new Error(`peerConnectionInfo is undefined.`);
          }
          peerConnectionInfo.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(data.candidate)).then(() => {
            
          });
        },
      },
    ],
  });

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
    webRtcManager.emitDataChannel<RtcData>({
      channelName: oneChannelName,
      data: {
        event: 'opponentMoving',
        data: movingInfo,
      },
      prevent(prevData) {
        if (typeof prevData === 'string') return true;
        if (prevData?.event === 'opponentMoving') {
          if (prevData?.data.direction === direction && prevData?.data.isRunning === movingInfo.isRunning) return true;
        }
        return false;
        // if (prevData?.direction === direction && prevData?.isRunning === movingInfo.isRunning) return true;
        // return false;
      },
    });
    babylonCharacterController.setCharacterMoving({ characterId, direction, isRunning });
  }

  function disposeJumping() {
    const c = babylonCharacterController.getCharacter(characterId);
    if (c === undefined) return;

    if (c !== undefined && c.isJumpPossible !== false) {
      // socketioManager.emit({
      //   eventName: 'meJumping', 
      //   data: { characterId, jumpingOptions: c.jumpingOptions },
      //   prevent() {
      //     return c.isJumpPossible === false;
      //   },
      // });
      webRtcManager.emitDataChannel<RtcData>({
        channelName: oneChannelName,
        data: {
          event: 'opponentJumping',
          data: { characterId, jumpingOptions: c.jumpingOptions },
        },
        prevent(prevData) {
          return c.isJumpPossible === false;
        },
      })
      babylonCharacterController.setCharacterJumping(characterId);
    }
  }

  function disposeChat(characterItem: IUseBabylonCharacterController.CharacterItem, chatData: ChatData) {
    const scene = sceneRef.current;
    if (scene === undefined) return;

    setChatItems(prev => {
      const newItems = [...prev];
      newItems.push(chatData);
      return newItems;
    });
    characterItem.add({
      groupName: 'chat-ballon',
      isAutoDeleteTimeout: 4000,
      babylonLogic: async() => {
        console.log('@babylonLogic...');
        const sizes = {
          width: 2.3,
          height: 1.3,
          size: 0.1,
        };
        const mesh = MeshBuilder.CreateBox('chat-ballon-mesh', {
          width: sizes.width,
          height: sizes.height,
          size: sizes.size,
        }, scene);

        const meshMaterial = new StandardMaterial("chat-ballon-mesh-material", scene);
        const bgBoxColor = new Color3(0, 0, 0);
        meshMaterial.ambientColor = bgBoxColor;
        meshMaterial.specularColor = bgBoxColor;
        meshMaterial.emissiveColor = bgBoxColor;
        meshMaterial.diffuseColor = bgBoxColor;
        meshMaterial.useLightmapAsShadowmap = true;
        meshMaterial.alpha = 0.7;

        mesh.material = meshMaterial;
        mesh.parent = characterItem.characterBox;
        mesh.visibility = 0;
    
        mesh.position.x = 0;
        mesh.position.y = characterItem.characterSize.y + 0.2;

        const planeHeight = sizes.height * 1.65;
        console.log('@planeHeight', planeHeight);
        const plane = MeshBuilder.CreatePlane('chat-ballon-plane', {
          width: sizes.width,
          height: planeHeight,
          // size: sizes.size,
        }, scene);
        plane.parent = mesh;
        plane.position.z = -0.01;
        plane.position.y = -0.4;

        // 
        const panel = new StackPanel();
        panel.zIndex = 10;
        panel.verticalAlignment = 0;
        panel.background = 'rgba(0, 0, 0, 0.7)';

        const advancedTexture = AdvancedDynamicTexture.CreateForMesh(plane);
        advancedTexture.addControl(panel);

        const textBlock = new TextBlock();
        textBlock.text = chatData.content;
        textBlock.color = "#ffffff";
        textBlock.paddingTop = 40;
        textBlock.paddingLeft = 40;
        textBlock.paddingRight = 40;
        textBlock.fontSize = 60;
        textBlock.fontFamily = "Noto Sans KR, sans-serif";
        // textBlock.width = "800px";
        textBlock.height = "600px";
        // textBlock.textWrapping = true;
        textBlock.textWrapping = 4;
        textBlock.adjustWordWrappingHTMLElement = (element) => {
          console.log('@element', element);
          element.style.wordBreak = 'break-all';
        };
        textBlock.fontWeight = 'bold';
        textBlock.shadowColor = 'black';
        textBlock.shadowOffsetX = 0;
        textBlock.shadowOffsetY = 0;
        textBlock.shadowBlur = 15;
        textBlock.textHorizontalAlignment = 0;
        textBlock.textVerticalAlignment = 0;
        panel.addControl(textBlock);

        return {
          meshes: [mesh, plane],
          others: [panel, textBlock, advancedTexture, meshMaterial],
        };
      },
    });
  }

  useKeyboardManager({
    onChangeKeyMapStatus(keyMap) {
      if (isCharacterControlBlock) return;

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

    const light = new DirectionalLight("dirLight", new Vector3(0, -1, 1), scene);
    light.position.z = -22;
    light.position.x = 22;
    light.position.y = 20;
    light.intensity = 0.7;
    light.shadowMinZ = 10;
    light.shadowMaxZ = 450;
    light.setDirectionToTarget(new Vector3(-1, 0, 1));

    const camera = new ArcRotateCamera("camera1", Math.PI / 2, -Math.PI / 2.5, 10, Vector3.Zero(), scene);
    // camera.attachControl();

    const shadowGenerator = new ShadowGenerator(4096, light, undefined, camera);
    shadowGeneratorRef.current = shadowGenerator;
    shadowGenerator.bias = 0.0003;

    const settingShadow = (mesh: AbstractMesh) => {
      mesh.receiveShadows = true;
      const shadowMap = shadowGenerator.getShadowMap();
      shadowMap?.renderList?.push(mesh);
    };

    // 바닥 셋팅
    babylonMeshPhysicsManager.injectObject({
      manageName: 'ground',
      mesh: (params) => {
        const { manageName } = params;
        const mesh = MeshBuilder.CreateBox(manageName, { width: 40, height: 2, depth: 40 }, scene);
        mesh.position.y = -1;

        const groundMaterial = new StandardMaterial("ground", scene);
        // groundMaterial.ambientColor = new Color3(1, 1, 1);
        groundMaterial.specularColor = new Color3(0, 0, 0);
        groundMaterial.emissiveColor = new Color3(0.2, 0.2, 0.2);
        groundMaterial.useLightmapAsShadowmap = true;
        mesh.material = groundMaterial;

        settingShadow(mesh);
        return mesh;
      },
      physicsBody: (params) => {
        const { mesh } = params;
        const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
        body.shape = new PhysicsShapeBox(
          new Vector3(0, 0, 0),
          Quaternion.Identity(),
          new Vector3(40, 2, 40),
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
        settingShadow(mesh);
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
        settingShadow(mesh);
        return mesh;
      },
      physicsBody: (params) => {
        const { mesh } = params;
        const body = new PhysicsBody(mesh, PhysicsMotionType.STATIC, false, scene);
        body.shape = new PhysicsShapeBox(
          new Vector3(0, 0, 0),
          Quaternion.Identity(),
          new Vector3(1.5, 1.5, 1.5),
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
        settingShadow(mesh);
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
      characterSize: { x: 1, y: 2, z: 1 },
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
        jumpingTotalDuration: 1600,
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
        settingShadow(mesh);  
      });
      setMeCharacterLoaded(true);
    });
  }

  useEffect(() => {
    if (!meCharacterLoaded) return;
    socketioManager.connect({
      socketUrl: process.env.NEXT_PUBLIC_WEBS_BABYLON_JS_EXAMPLE_SOCKET_CONNECT_URL ?? (() => { throw new Error(`NEXT_PUBLIC_WEBS_BABYLON_JS_EXAMPLE_SOCKET_CONNECT_URL 값이 없습니다.`) })(),
      opts: {
        auth: {
          token: authCheck.accessToken ?? '',
          clientId: characterId,
        },
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meCharacterLoaded]);

  useEffect(() => {
    if (babylonCharacterController.isThisClientCharacterControlling || babylonCharacterController.isExistThisClientCharacterNearOtherCharacters) {
      emitMeCurrentPositionAndRotationInterval.stop();
      emitMeCurrentPositionAndRotationInterval.start({ intervalTime: babylonCharacterController.isThisClientCharacterControlling ? 50 : 1000 });
      requestCurrentPositionAndRotationInterval.start();
    } else {
      emitMeCurrentPositionAndRotationInterval.stop();
      requestCurrentPositionAndRotationInterval.stop();

      emitInitMeCurrentPositionAndRotationInterval.stop();
      emitInitMeCurrentPositionAndRotationInterval.start({ intervalTime: 50 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [babylonCharacterController.isThisClientCharacterControlling, babylonCharacterController.isExistThisClientCharacterNearOtherCharacters])

  useEffect(() => {
    body.denyScroll();
    body.denyTextDrag();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socketioManager.isConnected === true && characterId !== '') {
      socketioManager.emit({ eventName: 'requestAllUsers', data: { clientId: characterId } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketioManager.isConnected, characterId]);

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
            if (isCharacterControlBlock) return;
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
            if (isCharacterControlBlock) return;
            disposeMoving({ direction: undefined, isRunning: false });
          }}
          />
      </div>
      <div className="fixed bottom-10 left-10 z-10">
        <TouchContainer
          className="w-[100px] h-[100px] bg-red-500/50 hover:bg-red-500/70 rounded-full"
          onTouchStart={() => { 
            if (isCharacterControlBlock) return;
            disposeJumping();
          }}
          />
      </div>
      <ChattingWindow 
        clientId={characterId}
        isShow={isChattingWindowShow}
        setIsShow={setIsChattingWindowShow}
        chatItems={chatItemsSorted}
        onFocusChangeInput={(isFocus) => {
          setIsChattingInputFocus(isFocus);
        }}
        onChatEmit={(content) => {

          const writerCharacter = babylonCharacterController.getCharacter(characterId);
          if (writerCharacter === undefined) return;

          const scene = sceneRef.current;
          if (scene === undefined) return;

          const writer = writerCharacter.characterNickName ?? 'undefined';
          const writerId = characterId;
          const writedAt = Date.now();

          disposeChat(writerCharacter, {
            writer,
            writerId,
            writedAt,
            content,
          });

          webRtcManager.emitDataChannel<RtcData>({
            channelName: oneChannelName,
            data: {
              event: 'chatInfo',
              data: {
                writedAt,
                writerId,
                writer,
                content,
              },
            },
          });
        }}
        />
    </>
  );
}