import { useEffect, useRef, useState } from "react";
import { IUsePromiseInterval } from "./use-promise-interval.interface";

export function usePromiseInterval<DATA, TYPE extends string>(props: IUsePromiseInterval.Props<DATA, TYPE>) {
  const {
    autoStart,
    promiseFn,
    intervalMillsecond,
  } = props;
  const promiseFnRef = useRef<() => Promise<DATA | undefined>>(promiseFn);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const isProcessingRef = useRef<boolean>(false);
  
  const [isPromiseExecuting, setIsPromiseExecuting] = useState<boolean>(false);
  const isPromiseExecutingRef = useRef<boolean>(false);
  
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>();
  const [data, setData] = useState<DATA | undefined>();
  const [type, setType] = useState<TYPE>();

  const timeoutRef = useRef<NodeJS.Timeout>();

  function start(options?: IUsePromiseInterval.StartOptions<DATA, TYPE>) {
    setType(options?.type);

    if (isProcessingRef.current) {
      // console.warn(`이미 동작중입니다.`);
      return;
    }

    if (promiseFn === undefined) {
      console.error(`promiseFn 이 할당되지 않았습니다.`);
      return;
    }

    isProcessingRef.current = true;
    setIsProcessing(true);
    setIsSuccess(undefined);

    const settingTimeout = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        call();
      }, intervalMillsecond);
    };

    const call = () => {
      if (isPromiseExecutingRef.current) return;
      isPromiseExecutingRef.current = true;
      setIsPromiseExecuting(true);
      
      const promise = promiseFnRef.current();
      promise.then(result => {
        isProcessingRef.current = false;
        setIsProcessing(false); 
        setIsSuccess(true);
        setData(result);
        clearTimeout(timeoutRef.current);
        if (typeof options?.success === 'function') {
          options?.success(result);
        }
      }).catch(error => {
        if (error === undefined) return;
        if (isProcessingRef.current === false) {
          clearTimeout(timeoutRef.current);
          return;
        }
        settingTimeout();
      }).finally(() => {
        isPromiseExecutingRef.current = false;
        setIsPromiseExecuting(false);
      });
    };

    if (options?.isNowCall !== false) {
      call();
    } else {
      settingTimeout();
    }
  }

  function stop() {
    isProcessingRef.current = false;
    setIsProcessing(false); 
    clearTimeout(timeoutRef.current);
  }

  useEffect(() => {
    if (autoStart?.enable === true) {
      start({
        isNowCall: autoStart.isNowCall,
      });
    }

    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    promiseFnRef.current = promiseFn;
  }, [promiseFn]);

  return {
    start,
    stop,
    isProcessing,
    isPromiseExecuting,
    isSuccess,
    data,
    type,
  };
}