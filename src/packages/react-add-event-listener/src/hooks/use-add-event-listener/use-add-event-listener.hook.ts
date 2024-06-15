import { useEffect, useRef } from "react";
import { IUseAddEventListener } from "./use-add-event-listener.interface";

export function useAddEventListener<K extends keyof HTMLElementEventMap, T extends keyof WindowEventMap>(props: IUseAddEventListener.Props<K, T>) {
  const {
    domEventRequiredInfo,
    windowEventRequiredInfo,
  } = props;

  const savedDomEventRequiredInfoRef = useRef<IUseAddEventListener.DomEventRequiredInfo<K>>();
  const savedWindowEventRequiredInfoRef = useRef<IUseAddEventListener.WindowEventRequiredInfo<T>>();
  
  const fixedCallbackRef = useRef((event: any) => {
    if (savedDomEventRequiredInfoRef.current !== undefined) {
      savedDomEventRequiredInfoRef.current.eventListener(event);
    }
    if (savedWindowEventRequiredInfoRef.current !== undefined) {
      savedWindowEventRequiredInfoRef.current.eventListener(event);
    }
  });

  function isTargetRef(value: any): value is { current: HTMLElement | null } {
    if (typeof value !== 'object') return false;
    if (value.current === undefined) return false;
    return true;
  }

  function isTargetSelector(value: any): value is IUseAddEventListener.SelectorString {
    if (typeof value !== 'string') return false;
    if (!value.startsWith(`selector:`)) return false;
    if (value.length <= 10) return false;
    return true;
  }

  useEffect(() => {
    const removeEvent = () => {
      if (domEventRequiredInfo !== undefined) {
        const {
          target,
          eventName,
          eventListener,
          options,
        } = domEventRequiredInfo;

        if (isTargetRef(target)) {
          target.current?.removeEventListener(eventName, fixedCallbackRef.current);
        } else if (isTargetSelector(target)) {
          const element = document.querySelector<HTMLElement>(target.replace(`selector:`, ''));
          element?.removeEventListener(eventName, fixedCallbackRef.current);
        } 
      }

      if (savedDomEventRequiredInfoRef.current !== undefined) {
        const {
          target,
          eventName,
          eventListener,
          options,
        } = savedDomEventRequiredInfoRef.current;

        if (isTargetRef(target)) {
          target.current?.removeEventListener(eventName, fixedCallbackRef.current);
        } else if (isTargetSelector(target)) {
          const element = document.querySelector<HTMLElement>(target.replace(`selector:`, ''));
          element?.removeEventListener(eventName, fixedCallbackRef.current);
        }
      }
    };
    removeEvent();

    if (domEventRequiredInfo !== undefined) {
      const {
        target,
        eventName,
        eventListener,
        options,
      } = domEventRequiredInfo;
      if (isTargetRef(target)) {
        target.current?.addEventListener(eventName, fixedCallbackRef.current, options);
      } else if (isTargetSelector(target)) {
        const element = document.querySelector<HTMLElement>(target.replace(`selector:`, ''));
        element?.addEventListener(eventName, fixedCallbackRef.current, options);
      } 
    }

    return () => {
      removeEvent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domEventRequiredInfo?.target, domEventRequiredInfo?.eventName, domEventRequiredInfo?.eventListener, domEventRequiredInfo?.options]);

  useEffect(() => {
    savedDomEventRequiredInfoRef.current = domEventRequiredInfo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domEventRequiredInfo?.target, domEventRequiredInfo?.eventName, domEventRequiredInfo?.eventListener, domEventRequiredInfo?.options]);

  useEffect(() => {
    const removeEvent = () => {
      if (windowEventRequiredInfo !== undefined && typeof window !== 'undefined') {
        const {
          eventName,
          eventListener,
          options,
        } = windowEventRequiredInfo;

        window.removeEventListener(eventName, fixedCallbackRef.current);
      }

      if (savedWindowEventRequiredInfoRef.current !== undefined && typeof window !== 'undefined') {
        const {
          eventName,
          eventListener,
          options,
        } = savedWindowEventRequiredInfoRef.current;

        window.removeEventListener(eventName, fixedCallbackRef.current);
      }
    };
    removeEvent();

    if (windowEventRequiredInfo !== undefined && typeof window !== 'undefined') {
      const {
        eventName,
        eventListener,
        options,
      } = windowEventRequiredInfo;
      window.addEventListener(eventName, fixedCallbackRef.current, options);
    }

    return () => {
      removeEvent();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowEventRequiredInfo?.eventName, windowEventRequiredInfo?.eventListener, windowEventRequiredInfo?.options]);

  useEffect(() => {
    savedWindowEventRequiredInfoRef.current = windowEventRequiredInfo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowEventRequiredInfo?.eventName, windowEventRequiredInfo?.eventListener, windowEventRequiredInfo?.options]);

  return {

  };
}
