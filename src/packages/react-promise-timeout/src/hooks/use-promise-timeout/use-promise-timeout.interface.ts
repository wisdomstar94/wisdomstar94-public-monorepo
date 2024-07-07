export declare namespace IUsePromiseTimeout {
  export interface StartOptions {
    /** 해당 값을 명시하면 해당 밀리세컨드로 동작하고, 명시하지 않으면 hook props 로 넘겼던 timeoutTime 밀리세컨드로 동작합니다. */
    timeoutTime?: number;
    /** start 메서드에 의해 interval 이 시작 되었을 때 바로 fn 에 명시한 함수가 호출되도록 할 것인지 여부입니다. 해당 값을 명시하면 hook props 의 isCallWhenStarted 은 무시되고 해당 값이 적용 됩니다. (기본 값: false) */
    isCallWhenStarted?: boolean;
    /** fn 비동기 작업이 아직 덜 끝난 상태에서 다시 timeout 을 호출했을 때 fn 을 호출할지 말지 여부입니다. 해당 값을 명시하면 hook props 의 isForceCallWhenFnExecuting 은 무시되고 해당 값이 적용 됩니다. (기본 값: true) */
    isForceCallWhenFnExecuting?: boolean;
  }

  export interface Props<T> {
    timeoutTime: number;  
    isCallWhenStarted?: boolean;
    isForceCallWhenFnExecuting?: boolean;
    isAutoStart?: boolean;
    fn: () => Promise<T | undefined>;
  }
}