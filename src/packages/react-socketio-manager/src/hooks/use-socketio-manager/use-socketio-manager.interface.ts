import { ManagerOptions, SocketOptions } from "socket.io-client";

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
    socketUrl: string;
    opts?: Partial<ManagerOptions & SocketOptions>;
  }

  export interface Props {
    listeners: ListenerItem[];
  }
}