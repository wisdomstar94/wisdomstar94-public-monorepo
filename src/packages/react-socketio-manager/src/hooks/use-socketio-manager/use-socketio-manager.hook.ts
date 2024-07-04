import { useEffect, useRef } from "react";
import { IUseSocketioManager } from "./use-socketio-manager.interface";
import { Socket, io } from "socket.io-client";

export function useSocketioManager(props: IUseSocketioManager.Props) {
  const {
    socketUrl,
    isAutoConnect,
    listeners,
  } = props;

  const socketRef = useRef<Socket>();

  function connect() {
    if (socketRef.current?.connected === true) {
      return;
    }

    const socket = io(`ws://${socketUrl.replace('http://', '').replace('https://', '').replace('ws://', '')}`, {
      reconnectionDelayMax: 1000 * 5,
      auth: {
        token: "123"
      },
      query: {
        "my-key": "my-value"
      }
    });
    socketRef.current = socket;
    setListners();
  }

  function disconnect() {
    socketRef.current?.disconnect();
  }

  function emit<T>(eventName: string, data: T) {
    if (socketRef.current?.connected !== true) {
      console.error(`socket 이 연결된 상태가 아닙니다..!`);
      return;
    }
    socketRef.current.emit(eventName, data);
  }

  function setListners() {
    if (socketRef.current === undefined) {
      console.error(`socket 이 연결된 상태가 아닙니다.!`);
      return;
    }

    const socket = socketRef.current;
    listeners.forEach((item) => {
      socket.on(item.eventName, (data: any) => {
        item.callback(data);
      });
    });
  }

  useEffect(() => {
    if (isAutoConnect) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAutoConnect]);

  return {
    connect,
    disconnect,
    emit,
  };
}