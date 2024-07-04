export declare namespace IUseSocketioManager {
  export interface ListenerItem {
    eventName: string;
    callback: (data: any) => void;
  }

  export interface Props {
    socketUrl: string;
    isAutoConnect: boolean;
    listeners: ListenerItem[];
  }
}