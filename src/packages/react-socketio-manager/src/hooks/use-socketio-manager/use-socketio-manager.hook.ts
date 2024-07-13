import { useEffect, useRef, useState } from "react";
import { IUseSocketioManager } from "./use-socketio-manager.interface";
import { Socket, io } from "socket.io-client";

export function useSocketioManager(props: IUseSocketioManager.Props) {
  const {
    socketUrl,
    isAutoConnect,
    listeners,
  } = props;

  const [socket, setSocket] = useState<Socket>();
  const socketRef = useRef<Socket>();
  const [isConnected, setIsConnected] = useState(false);
  const prevEmitInfo = useRef<Map<string, any>>(new Map());
  const prevListenersRef = useRef(listeners);

  function connect(options?: IUseSocketioManager.ConnectOptions) {
    if (socketRef.current?.connected === true) {
      return;
    }

    const socket = io(`ws://${socketUrl.replace('http://', '').replace('https://', '').replace('ws://', '')}`, {
      reconnectionDelayMax: 1000 * 5,
      auth: {
        token: options?.authToken,
      },
      query: {
        "my-key": "my-value"
      }
    });
    setSocket(socket);
    socketRef.current = socket;
    // setListners();
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });
  }

  function disconnect() {
    socketRef.current?.disconnect();
  }

  function emit<T>(options: IUseSocketioManager.EmitOptions<T>) {
    const {
      eventName,
      data,
      prevent,
    } = options;

    if (socketRef.current?.connected !== true) {
      console.error(`socket 이 연결된 상태가 아닙니다..!`);
      return;
    }

    if (typeof prevent === 'function') {
      if (prevent(prevEmitInfo.current.get(eventName))) {
        console.warn('prevent 조건에 의해 emit 이 발생하지 않았습니다.');
        return;
      }
    }

    socketRef.current.emit(eventName, data);
    prevEmitInfo.current.set(eventName, data);
  }

  function getSocketId() {
    const socket = socketRef.current;
    if (socket === undefined) {
      throw new Error(`socket 이 연결되지 않았습니다.`);
    }
    if (socket.id === undefined) {
      throw new Error(`socket 이 연결되지 않았습니다..`);
    }
    return socket.id;
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

  useEffect(() => {
    if (socket === undefined) return;

    listeners.forEach((item) => {
      const prevListener = prevListenersRef.current.find(x => x.eventName === item.eventName);
      if (prevListener !== undefined) {
        socket.off(item.eventName, prevListener.callback);
      }
      socket.on(item.eventName, item.callback);
    });

    prevListenersRef.current = listeners;
  }, [listeners, socket]);

  return {
    connect,
    disconnect,
    emit,
    getSocketId,
    isConnected,
    socket,
  };
}