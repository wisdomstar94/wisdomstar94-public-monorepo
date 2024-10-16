export declare namespace IUseSseManager {
  export type CustomEventListenerMapInfo = {
    eventName: string;
    listener: (this: EventSource, event: MessageEvent) => any;
    options?: boolean | AddEventListenerOptions;
  };

  export type DefaultEventListenerMapInfo = {
    eventName: keyof EventSourceEventMap;
    listener: any;
    options?: boolean | AddEventListenerOptions;
  };

  export type ConnectStateConnecting = {
    state: 'connecting';
  };

  export type ConnectStateConnected = {
    state: 'connected';
  };

  export type ConnectStateNotConnected = {
    state: 'not-connected';
    reason: 'not-initialize' | 'disconnect-fn-called';
  };

  export type ConnectStateError = {
    state: 'error';
    error: Event;
  };

  export type ConnectState = ConnectStateConnecting | ConnectStateConnected | ConnectStateNotConnected | ConnectStateError;

  export type SetDefaultEventListenerParams<K extends keyof EventSourceEventMap> = {
    eventName: K;
    listener: (this: EventSource, event: EventSourceEventMap[K]) => any;
    options?: boolean | AddEventListenerOptions;
  };

  export type SetCustomEventListenerParams = {
    eventName: string;
    listener: (this: EventSource, event: MessageEvent) => any;
    options?: boolean | AddEventListenerOptions;
  };

  export type EventSourceInfo = {
    eventSource: EventSource;
  };

  export type ConnectOption = {
    url: string;
    eventSourceInitDict?: EventSourceInit;
  };

  export type AutoConnectEnableTrue = {
    enable: true;
    connectOption: ConnectOption;
  };

  export type AutoConnectEnableFalse = {
    enable: false;
    connectOption: ConnectOption;
  };

  export type AutoConnect = AutoConnectEnableTrue | AutoConnectEnableFalse;

  export type MountedOptions = {
    autoConnect?: AutoConnect;
  };

  export type Props = {
    mountedOptions?: MountedOptions;
  };
}
