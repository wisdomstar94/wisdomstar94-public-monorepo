import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";
import { IBabylonCanvas } from "./babylon-canvas.interface";
import { useEffect, useRef, useState } from "react";
import { Engine, WebGPUEngine } from "@babylonjs/core";

export function BabylonCanvas(props: IBabylonCanvas.Props) {
  const {
    canvasRef,
    onReady,
  } = props;

  const enginesRef = useRef<IBabylonCanvas.Engines>();
  const [isReady, setIsReady] = useState(false);
  const [isReadyed, setIsIsReadyed] = useState(false);

  // function resizeCanvas() {
  //   const canvasElement = canvasRef?.current;
  //   if (canvasElement === undefined || canvasElement === null) return;

  //   const parentElement = canvasRef?.current?.parentElement;
  //   if (parentElement === undefined || parentElement === null) return;

  //   // const bounds = parentElement.getBoundingClientRect();  
  //   // const parentWidth = bounds.width;
  //   // const parentHeight = bounds.height;
  //   // canvasElement.width = parentWidth;
  //   // canvasElement.height = parentHeight;
  //   // canvasElement.style.width = `${parentWidth}px`;
  //   // canvasElement.style.height = `${parentHeight}px`;
  // }

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'resize',
      eventListener(event) {
        enginesRef.current?.engine.resize();
        // resizeCanvas();
      },
    },
  });

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef?.current;
    if (canvas === null || canvas === undefined) return;
    if (isReady !== true) return;

    WebGPUEngine.IsSupportedAsync.then((isSupported) => {
      if (isSupported) {
        const engine = new WebGPUEngine(canvas);
        enginesRef.current = { engine };
        enginesRef.current.webGPUEngine = engine;
        engine.initAsync().then(() => {
          if (typeof onReady === 'function') onReady({ webGPUEngine: engine, engine });
          setIsIsReadyed(true);
        });
      } else {
        const engine = new Engine(canvas);
        enginesRef.current = { engine };
        enginesRef.current.webGLEngine = engine;
        if (typeof onReady === 'function') onReady({ webGLEngine: engine, engine });
        setIsIsReadyed(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    // resizeCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    enginesRef.current?.engine.resize();
  }, [isReadyed]);

  return (
    <>
      <canvas style={{ width: '100%', height: '100%' }} ref={canvasRef}></canvas>
    </>
  );
}