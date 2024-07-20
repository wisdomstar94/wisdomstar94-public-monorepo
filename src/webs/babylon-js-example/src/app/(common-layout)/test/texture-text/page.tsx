"use client"

import { useAuthCheck } from "@/hooks/use-auth-check/use-auth-check.hook";
import { AbstractMesh, ActionManager, ArcRotateCamera, Color3, DirectionalLight, DynamicTexture, HavokPlugin, HemisphericLight, MeshBuilder, PhysicsBody, PhysicsMotionType, PhysicsShapeBox, Quaternion, Scene, ShadowGenerator, StandardMaterial, Vector3 } from "@babylonjs/core";
import HavokPhysics from "@babylonjs/havok";
import { BabylonCanvas, IBabylonCanvas, IUseBabylonCharacterController, useBabylonCharacterController, useBabylonMeshPhysicsManager } from "@wisdomstar94/react-babylon-utils";
import { useBody } from "@wisdomstar94/react-body";
import { useSocketioManager } from "@wisdomstar94/react-socketio-manager";
import { useWebRtcManager } from "@wisdomstar94/react-web-rtc-manager";
import { useEffect, useRef, useState } from "react";
import "@babylonjs/loaders/glTF";
import { usePromiseInterval } from "@wisdomstar94/react-promise-interval";
import { useKeyboardManager } from "@wisdomstar94/react-keyboard-manager";
import { usePromiseTimeout } from "@wisdomstar94/react-promise-timeout";
import { Joystick } from "@wisdomstar94/react-joystick";
import { TouchContainer } from "@wisdomstar94/react-touch-container";

export default function Page() {
  const sceneRef = useRef<Scene>();
  const shadowGeneratorRef = useRef<ShadowGenerator>();

  const body = useBody();
  const [meCharacterLoaded, setMeCharacterLoaded] = useState(false);

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
    camera.attachControl();

    const shadowGenerator = new ShadowGenerator(4096, light, undefined, camera);
    shadowGeneratorRef.current = shadowGenerator;
    shadowGenerator.bias = 0.0003;

    const settingShadow = (mesh: AbstractMesh) => {
      mesh.receiveShadows = true;
      const shadowMap = shadowGenerator.getShadowMap();
      shadowMap?.renderList?.push(mesh);
    };

    // 
    // 캐릭터 닉네임이 표시되는 메쉬
    const text = '안녕하세요~^^';
    const box = MeshBuilder.CreateBox('box', {
      width: 0.5 * text.length, // x 축 길이
      height: 0.4, // y 축 길이
      size: 0.01, // z 축 길이
    });

    const boxdMaterial = new StandardMaterial("box-material", scene);
    const baseColor = new Color3(1, 0, 0);
    boxdMaterial.ambientColor = baseColor;
    boxdMaterial.specularColor = baseColor;
    boxdMaterial.emissiveColor = baseColor;
    boxdMaterial.diffuseColor = baseColor;
    boxdMaterial.useLightmapAsShadowmap = true;
    boxdMaterial.alpha = 0.7;
        
    box.material = boxdMaterial;

    const fontSize = 64; 
    const font = fontSize + "px " + "sans-serif";

    // const dynamicTexture = new DynamicTexture('box-texture', { width: 512, height: 70, }, scene);
    // const dynamicTextureContext = dynamicTexture.getContext();
    // dynamicTextureContext.clearRect(0, 0, 512, 70);
    // // boxdMaterial.diffuseTexture = dynamicTexture;
    // // boxdMaterial.diffuseTexture.hasAlpha = true;
    // dynamicTexture.drawText(text, null, null, font, "#ffffff", null, true);




    const box2 = MeshBuilder.CreateBox('box', {
      width: 0.5 * text.length, // x 축 길이
      height: 0.4, // y 축 길이
      size: 0.01, // z 축 길이
    });
    box2.position.z = -0.01;
    const boxdMaterial2 = new StandardMaterial("box-material", scene);
    const baseColor2 = new Color3(1, 1, 1);
    boxdMaterial2.ambientColor = baseColor2;
    boxdMaterial2.specularColor = baseColor2;
    boxdMaterial2.emissiveColor = baseColor2;
    boxdMaterial2.diffuseColor = baseColor2;
    boxdMaterial2.useLightmapAsShadowmap = true;
    // boxdMaterial2.alpha = 0.7;

    box2.material = boxdMaterial2;

    const fontSize2 = 64; 
    const font2 = fontSize2 + "px " + "sans-serif";

    const dynamicTexture2 = new DynamicTexture('box-texture', { width: 512, height: 70, }, scene);
    const dynamicTextureContext2 = dynamicTexture2.getContext();
    dynamicTextureContext2.clearRect(0, 0, 512, 512);
    dynamicTexture2.drawText(text, null, null, font, "#ffffff", "transparent", true);
    boxdMaterial2.diffuseTexture = dynamicTexture2;
    boxdMaterial2.diffuseTexture.hasAlpha = true;
  }

  useEffect(() => {
    body.denyScroll();
    body.denyTextDrag();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    </>
  );
}