import { useEffect, useRef, useState } from 'react';
import { IUseSseManager } from './use-sse-manager.type';

export function useSseManager(props: IUseSseManager.Props) {
  const { mountedOptions } = props;

  const isConnecting = useRef(false);
  const [connectState, setConnectState] = useState<IUseSseManager.ConnectState>(
    mountedOptions?.autoConnect?.enable === true
      ? {
          state: 'connecting',
        }
      : {
          state: 'not-connected',
          reason: 'not-initialize',
        }
  );
  const sseEventSourceInfo = useRef<IUseSseManager.EventSourceInfo | undefined>();

  // listener bucket
  const defaultOpenListener = useRef<(event: Event) => any>((event: Event) => {
    isConnecting.current = false;
    setConnectState({ state: 'connected' });
  });
  const defaultErrorListener = useRef<(event: Event) => any>((event: Event) => {
    isConnecting.current = false;
    setConnectState({ state: 'error', error: event });
  });
  const defaultEventListenerMap = useRef<Map<keyof EventSourceEventMap, IUseSseManager.DefaultEventListenerMapInfo>>(new Map());
  const customEventListenerMap = useRef<Map<string, IUseSseManager.CustomEventListenerMapInfo>>(new Map());

  function connect(option: IUseSseManager.ConnectOption) {
    if (isConnecting.current) return;

    if (sseEventSourceInfo.current !== undefined) {
      console.warn('이미 connect 된 상태입니다.');
      return;
    }

    isConnecting.current = true;
    const eventSource = new EventSource(option.url, option.eventSourceInitDict);
    sseEventSourceInfo.current = { eventSource };

    // eventSource.addEventListener('open', defaultOpenListener.current);
    // eventSource.addEventListener('error', defaultErrorListener.current);
    eventSource.onopen = defaultOpenListener.current;
    eventSource.onerror = defaultErrorListener.current;
  }
  // const connectRef = useRef(connect);

  function disconnect() {
    const sseEventSource = sseEventSourceInfo.current;
    if (sseEventSource === undefined) {
      console.warn('이미 disconnect 된 상태입니다.');
      return;
    }

    sseEventSource.eventSource.close();
    setConnectState({ state: 'not-connected', reason: 'disconnect-fn-called' });

    isConnecting.current = false;

    // sseEventSource.eventSource.removeEventListener('open', defaultOpenListener.current);
    // sseEventSource.eventSource.removeEventListener('error', defaultErrorListener.current);
    sseEventSource.eventSource.onopen = null;
    sseEventSource.eventSource.onerror = null;

    defaultEventListenerMap.current.forEach((info, eventName) => {
      sseEventSource.eventSource.removeEventListener(eventName, info.listener, info.options);
    });
    customEventListenerMap.current.forEach((info, eventName) => {
      sseEventSource.eventSource.removeEventListener(eventName, info.listener, info.options);
    });

    sseEventSourceInfo.current = undefined;
  }

  function setDefaultEventListener<K extends keyof EventSourceEventMap>(params: IUseSseManager.SetDefaultEventListenerParams<K>) {
    const sseEventSource = sseEventSourceInfo.current;
    if (sseEventSource === undefined) {
      return;
    }

    const { eventSource } = sseEventSource;

    // 기존 리스너 제거
    const target = defaultEventListenerMap.current.get(params.eventName);
    if (target !== undefined) {
      eventSource.removeEventListener(params.eventName, target.listener, target.options);
    }

    // 새로운 리스너 할당
    eventSource.addEventListener(params.eventName, params.listener, params.options);
    defaultEventListenerMap.current.set(params.eventName, {
      eventName: params.eventName,
      listener: params.listener,
      options: params.options,
    });
  }

  function setCustomEventListener(params: IUseSseManager.SetCustomEventListenerParams) {
    const sseEventSource = sseEventSourceInfo.current;
    if (sseEventSource === undefined) {
      return;
    }

    const { eventSource } = sseEventSource;

    // 기존 리스너 제거
    const target = customEventListenerMap.current.get(params.eventName);
    if (target !== undefined) {
      eventSource.removeEventListener(params.eventName, target.listener, target.options);
    }

    // 새로운 리스너 할당
    eventSource.addEventListener(params.eventName, params.listener, params.options);
    customEventListenerMap.current.set(params.eventName, {
      eventName: params.eventName,
      listener: params.listener,
      options: params.options,
    });
  }

  useEffect(() => {
    if (mountedOptions === undefined) return;

    if (mountedOptions.autoConnect?.enable === true) {
      console.log('@connect 호출됨.');
      connect(mountedOptions.autoConnect.connectOption);
    }

    return () => {
      console.log('@disconnect 호출됨.');
      disconnect();
    };
  }, []);

  return {
    connectState,
    connect,
    disconnect,
    setDefaultEventListener,
    setCustomEventListener,
  };
}
