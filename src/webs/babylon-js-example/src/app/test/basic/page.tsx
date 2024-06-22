"use client"

import { BabylonCanvas } from "@/components/babylon-canvas/babylon-canvas.component";
import { useEffect, useRef } from "react";

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core";

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log('@canvasRef', canvasRef); 
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const engine = new Engine(canvas);
    const scene = new Scene(engine);

    const camera = new FreeCamera("camera1", new Vector3(0, 50, -50), scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const ground = MeshBuilder.CreateGround("ground1", { width: 40, height: 40 });
    ground.position.y = 2;

    engine.runRenderLoop(() => {
      scene.render();
  });
  }, []);

  return (
    <>
      <div className="w-[1000px] h-[600px] bg-blue-200 relative">
        <BabylonCanvas canvasRef={canvasRef} />
      </div>
    </>
  );
}