import { useCallback, useEffect, useRef, useState } from "react";
import { IUseRequestAnimationFrameManager } from "./use-request-animation-frame-manager.interface";

export function useRequestAnimationFrameManager(props: IUseRequestAnimationFrameManager.Props) {
  const {
    isAutoStart,
    callback,
  } = props;
  
  const requestRef = useRef<number>();
  const callbackRef = useRef<(startedTimestamp: number, currentTimestamp: number, timestamp: number) => void>(callback);
  callbackRef.current = callback;

  const [isReady, setIsReady] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);
  const [isSleeping, setIsSleeping] = useState<boolean>(false);
  const isSleepingRef = useRef<boolean>(false);

  const start = useCallback(() => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessing(true);

    const nowTimestamp = window.performance.timeOrigin + window.performance.now();

    const call = (step: number) => {
      callbackRef.current(nowTimestamp, window.performance.timeOrigin + window.performance.now(), step);
      requestRef.current = requestAnimationFrame(call);
    };

    requestRef.current = requestAnimationFrame(call);
  }, []);

  const stop = useCallback(() => {
    isProcessingRef.current = false;
    setIsProcessing(false);
    isSleepingRef.current = true;
    setIsSleeping(true);
    if (requestRef.current !== undefined) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (isAutoStart === true) {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  useEffect(() => {
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isReady,
    isProcessing,
    isSleeping,
    start,
    stop,
  };
}