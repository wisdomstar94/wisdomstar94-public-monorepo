import { useRef } from "react";
import { IUseKeyboardManager } from "./use-keyboard-manager.interface";
import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";

export function useKeyboardManager(props?: IUseKeyboardManager.Props) {
  const keyMapRef = useRef<Map<string, boolean>>(new Map());

  const {
    onChangeKeyMapStatus,
  } = props ?? {};

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'blur',
      eventListener(event) {
        keyMapRef.current.clear();
        if (typeof onChangeKeyMapStatus === 'function') onChangeKeyMapStatus(keyMapRef.current);
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'keyup',
      eventListener(event) {
        const key = event.key;
        keyMapRef.current.set(key, false);
        if (typeof onChangeKeyMapStatus === 'function') onChangeKeyMapStatus(keyMapRef.current);
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'keydown',
      eventListener(event) {
        const key = event.key;
        keyMapRef.current.set(key, true);
        if (typeof onChangeKeyMapStatus === 'function') onChangeKeyMapStatus(keyMapRef.current);
      },
    },
  });
}