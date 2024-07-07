import { useEffect, useRef, useState } from "react";
import { IUsePromiseTimeout } from "./use-promise-timeout.interface";

export function usePromiseTimeout<T>(props: IUsePromiseTimeout.Props<T>) {
  const {
    timeoutTime,
    isCallWhenStarted,
    isForceCallWhenFnExecuting,
    isAutoStart,
    fn,
  } = props;

  const [isFnCalling, setIsFnCalling] = useState(false);
  const isFnCallingRef = useRef(false);

  const fnRef = useRef(fn);
  fnRef.current = fn;

  const timeout = useRef<NodeJS.Timeout>();

  function setIsFnCallingWrapper(v: boolean) {
    isFnCallingRef.current = v;
    setIsFnCalling(v);
  }

  function start(options?: IUsePromiseTimeout.StartOptions) {
    if (timeout.current !== undefined) {
      console.warn('이미 timeout 실행중입니다.');
      return;
    }

    const applyTimeoutTime = options?.timeoutTime ?? timeoutTime;
    const applyIsCallWhenStarted = (options?.isCallWhenStarted ?? isCallWhenStarted) ?? false;
    const applyIsForceCallWhenFnExecuting = (options?.isForceCallWhenFnExecuting ?? isForceCallWhenFnExecuting) ?? true;

    const call = () => {
      if (isFnCallingRef.current && !applyIsForceCallWhenFnExecuting) {
        return;
      }

      setIsFnCallingWrapper(true);
      fnRef.current().then(res => {
        
      }).catch((error) => {

      }).finally(() => {
        setIsFnCallingWrapper(false);
      });
    };

    if (applyIsCallWhenStarted) {
      call();
    }

    timeout.current = setTimeout(() => {
      call();
      stop();
    }, applyTimeoutTime);
  }

  function stop() {
    clearTimeout(timeout.current);
    timeout.current = undefined;
  }

  function fnCall() {
    return fnRef.current();
  }

  useEffect(() => {
    if (isAutoStart === true) {
      start();
    } else {
      stop();
    }

    return () => {
      stop();
    };
  }, [isAutoStart]);

  return {
    start,
    stop,
    fnCall,
    isFnCalling,
  };
}