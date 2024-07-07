import { useEffect, useRef, useState } from "react";
import { IUsePromiseInterval } from "./use-promise-interval.interface";

export function usePromiseInterval<T>(props: IUsePromiseInterval.Props<T>) {
  const {
    intervalTime,
    isCallWhenStarted,
    isForceCallWhenFnExecuting,
    isAutoStart,
    callMaxCount,
    fn,
  } = props;

  const [isFnCalling, setIsFnCalling] = useState(false);
  const isFnCallingRef = useRef(false);

  const [isIntervalExecuting, setIsIntervalExecuting] = useState(false);

  const fnRef = useRef(fn);
  fnRef.current = fn;

  const calledCountRef = useRef(0);
  const callMaxCountRef = useRef<number>();

  const interval = useRef<NodeJS.Timeout>();

  function setIsFnCallingWrapper(v: boolean) {
    isFnCallingRef.current = v;
    setIsFnCalling(v);
  }

  function start(options?: IUsePromiseInterval.StartOptions) {
    if (interval.current !== undefined) {
      console.warn('이미 interval 실행중입니다.');
      return;
    }

    setIsIntervalExecuting(true);

    const applyIntervalTime = options?.intervalTime ?? intervalTime;
    const applyIsCallWhenStarted = (options?.isCallWhenStarted ?? isCallWhenStarted) ?? false;
    const applyIsForceCallWhenFnExecuting = (options?.isForceCallWhenFnExecuting ?? isForceCallWhenFnExecuting) ?? true;
    const applyCallMaxCount = options?.callMaxCount ?? callMaxCount;
    callMaxCountRef.current = applyCallMaxCount;
    calledCountRef.current = 0;

    const call = () => {
      if (isFnCallingRef.current && !applyIsForceCallWhenFnExecuting) {
        return;
      }

      setIsFnCallingWrapper(true);
      calledCountRef.current++;
      fnRef.current().then(res => {
        
      }).catch((error) => {

      }).finally(() => {
        setIsFnCallingWrapper(false);
        if (callMaxCountRef.current === undefined) return;
        if (calledCountRef.current >= callMaxCountRef.current) {
          stop();
        }
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
    setIsIntervalExecuting(false);
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
    isFnCalling,
    isIntervalExecuting,
  };
}