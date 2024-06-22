import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";
import { IBabylonCanvas } from "./babylon-canvas.interface";
import { useEffect, useState } from "react";

export function BabylonCanvas(props: IBabylonCanvas.Props) {
  const {
    canvasRef,
    onReady,
  } = props;

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      if (typeof onReady === 'function') {
        onReady();
      }
    }
  }, [isReady]);

  function resizeCanvas() {
    const canvasElement = canvasRef?.current;
    if (canvasElement === undefined || canvasElement === null) return;

    const parentElement = canvasRef?.current?.parentElement;
    if (parentElement === undefined || parentElement === null) return;

    const bounds = parentElement.getBoundingClientRect();  
    const parentWidth = bounds.width;
    const parentHeight = bounds.height;
    canvasElement.width = parentWidth;
    canvasElement.height = parentHeight;
    canvasElement.style.width = `${parentWidth}px`;
    canvasElement.style.height = `${parentHeight}px`;
  }

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'resize',
      eventListener(event) {
        resizeCanvas();
      },
    },
  });

  useEffect(() => {
    resizeCanvas();
  }, []);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
}