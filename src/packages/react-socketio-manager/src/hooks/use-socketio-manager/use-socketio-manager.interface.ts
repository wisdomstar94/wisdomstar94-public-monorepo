export declare namespace IUseSocketioManager {
  export interface ListenerItem {
    eventName: string;
    callback: (...args: any[]) => void;
  }

  export interface EmitOptions<T> {
    eventName: string; 
    data: T;
    prevent?: (prevData: T | undefined) => boolean;
  }

  export interface ConnectOptions {
    authToken?: string;
  }

  export interface Props {
    socketUrl: string;
    isAutoConnect: boolean;
    listeners: ListenerItem[];
  }
}