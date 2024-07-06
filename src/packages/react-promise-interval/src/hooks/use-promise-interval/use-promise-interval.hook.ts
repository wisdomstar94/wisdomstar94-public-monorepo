import { useEffect, useRef } from "react";
import { IUsePromiseInterval } from "./use-promise-interval.interface";

export function usePromiseInterval<T>(props: IUsePromiseInterval.Props<T>) {
  const {
    intervalTime,
    isCallWhenStarted,
    isForceCallWhenFnExecuting,
    isAutoStart,
    fn,
  } = props;

  const fnRef = useRef(fn);
  fnRef.current = fn;

  const isFnCalling = useRef(false);
  const interval = useRef<NodeJS.Timeout>();

  function start(options?: IUsePromiseInterval.StartOptions) {
    if (interval.current !== undefined) {
      console.warn('이미 interval 실행중입니다.');
      return;
    }

    const applyIntervalTime = options?.intervalTime ?? intervalTime;
    const applyIsCallWhenStarted = (options?.isCallWhenStarted ?? isCallWhenStarted) ?? false;
    const applyIsForceCallWhenFnExecuting = (options?.isForceCallWhenFnExecuting ?? isForceCallWhenFnExecuting) ?? true;

    const call = () => {
      if (isFnCalling.current && !applyIsForceCallWhenFnExecuting) {
        return;
      }

      isFnCalling.current = true;
      fnRef.current().then(res => {
        
      }).catch((error) => {

      }).finally(() => {
        isFnCalling.current = false;
      });
    };

    if (applyIsCallWhenStarted) {
      call();
    }

    interval.current = setInterval(() => {
      call();
    }, applyIntervalTime);
  }

  function stop() {
    clearInterval(interval.current);
    interval.current = undefined;
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
  };
}