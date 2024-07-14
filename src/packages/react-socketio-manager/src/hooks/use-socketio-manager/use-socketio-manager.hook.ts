import { useEffect, useRef, useState } from "react";
import { IUseSocketioManager } from "./use-socketio-manager.interface";
import { Socket, io } from "socket.io-client";

export function useSocketioManager(props: IUseSocketioManager.Props) {
  const {
    listeners,
  } = props;

  const [socket, setSocket] = useState<Socket>();
  const socketRef = useRef<Socket>();
  const [isConnected, setIsConnected] = useState(false);
  const prevEmitInfo = useRef<Map<string, any>>(new Map());
  const prevListenersRef = useRef(listeners);

  function setSocketWrapper(s: Socket | undefined) {
    if (s === undefined) {
      listeners.forEach((item) => {
        const prevListener = prevListenersRef.current.find(x => x.eventName === item.eventName);
        if (prevListener !== undefined) {
          socketRef.current?.off(item.eventName, prevListener.callback);
        }
        socketRef.current?.off(item.eventName, item.callback);
      });
    }

    setSocket(s);
    socketRef.current = s;
  }

  function connect(connectOptions: IUseSocketioManager.ConnectOptions) {
    if (socketRef.current !== undefined) {
      return;
    }

    const socket = io(`ws://${connectOptions.socketUrl.replace('http://', '').replace('https://', '').replace('ws://', '')}`, connectOptions?.opts);
    setSocketWrapper(socket);

    const onConnected = () => {
      setIsConnected(true);
    };

    const onDisconnected = (reason: Socket.DisconnectReason) => {
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        socket.off('connect', onConnected);
        socket.off('disconnect', onDisconnected);
        setSocketWrapper(undefined);
      }
    };

    socket.on('connect', onConnected);
    socket.on('disconnect', onDisconnected);
  }

  function disconnect() {
    socketRef.current?.disconnect();
    setSocketWrapper(undefined);
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
    return () => {
      disconnect();
    };
  }, []);

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
  }, [listeners, socket, isConnected]);

  return {
    connect,
    disconnect,
    emit,
    getSocketId,
    isConnected,
    socket,
  };
}