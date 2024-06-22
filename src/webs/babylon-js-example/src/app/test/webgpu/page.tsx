"use client"

import { BabylonCanvas } from "@/components/babylon-canvas/babylon-canvas.component";
import { useEffect, useRef } from "react";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { AnimationPropertiesOverride, MeshBuilder, SceneLoader, UniversalCamera, WebGPUEngine } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
// import '@babylonjs/core/Engines/WebGPU/Extensions';

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  async function onReady() {
    console.log('@canvasRef', canvasRef); 
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const engine = new WebGPUEngine(canvas);
    await engine.initAsync();
    // engine.enableGPUTimingMeasurements = true;
    // engine.snapshotRendering = true;
    const scene = new Scene(engine);
    // scene.animationPropertiesOverride = new AnimationPropertiesOverride();
    // scene.animationPropertiesOverride.enableBlending = true;
    // scene.animationPropertiesOverride.blendingSpeed = 0.05;
    // scene.animationPropertiesOverride.loopMode = 1;
    
    const camera = new UniversalCamera("camera1", new Vector3(0, 10, -5), scene);
    camera.setTarget(new Vector3(0, 0, 30));
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const ground = MeshBuilder.CreateGround("ground1", { width: 40, height: 40 });
    ground.position.y = 2;

    SceneLoader.ImportMeshAsync(undefined, "/models/", "untitled.glb", scene).then((result) => {
      console.log('@result', result);
      // result.animationGroups.at(0)?.stop();
      // result.animationGroups.at(2)?.start(true);
      console.log('@scene.animationPropertiesOverride', scene.animationPropertiesOverride); 

      // animation group 간에 부드럽게 전환되는 효과를 위해서는 아래와 같이 작성해주어야 함.
      if (scene.animationPropertiesOverride === null) {
        scene.animationPropertiesOverride = new AnimationPropertiesOverride();
        scene.animationPropertiesOverride.enableBlending = true;
        scene.animationPropertiesOverride.blendingSpeed = 0.05;
      }

      setTimeout(() => {
        result.animationGroups.at(2)?.start(true);
      }, 2000);

      setTimeout(() => {
        result.animationGroups.at(1)?.start(true);
        
      }, 3000);

      result.meshes.forEach(x => {
        x.position.x = 0;
        x.position.y = 8;
        x.position.z = 0;
        x.rotate(new Vector3(0, 0, 0), 10);

      });
    });

    engine.runRenderLoop(() => {
      scene.render();
    });
  }

  useEffect(() => {
    
  }, []);

  return (
    <>
      <div className="w-[1000px] h-[600px] bg-blue-200 relative">
        <BabylonCanvas canvasRef={canvasRef} onReady={onReady} />
      </div>
    </>
  );
}