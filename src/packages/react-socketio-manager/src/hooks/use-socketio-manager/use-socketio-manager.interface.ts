export declare namespace IUseSocketioManager {
  export interface ListenerItem {
    eventName: string;
    callback: (data: any) => void;
  }

  export interface EmitOptions<T> {
    eventName: string; 
    data: T;
    prevent?: (prevData: T | undefined) => boolean;
  }

  export interface Props {
    socketUrl: string;
    isAutoConnect: boolean;
    listeners: ListenerItem[];
  }
}