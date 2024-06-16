import { RefObject, useCallback, useRef, useState } from "react";
import styles from './use-body.module.css';
import { IUseBody } from "./use-body.interface";

export function useBody(ref?: RefObject<HTMLElement>) {
  const latestScrollYRef = useRef<number>(0);
  const latestScrollXRef = useRef<number>(0);

  const latestScrollTargetYRef = useRef<number>(0);
  const latestScrollTargetXRef = useRef<number>(0);

  const [scrollState, setScrollState] = useState<IUseBody.State>('allow');
  const [textDragState, setTextDragState] = useState<IUseBody.State>('allow');

  const denyScroll = useCallback(() => {
    if (ref !== undefined && ref.current !== null) {
      latestScrollTargetYRef.current = ref.current.scrollTop;
      latestScrollTargetXRef.current = ref.current.scrollLeft;
      ref.current.classList.add(styles['scroll-target-scroll-block']);
      ref.current.style.top = `-${latestScrollTargetYRef.current}px`;
      ref.current.style.left = `-${latestScrollTargetXRef.current}px`;
    } else {
      latestScrollYRef.current = window.scrollY;
      latestScrollXRef.current = window.scrollX;
      document.querySelector('html')?.classList.add(styles['html-window-scroll-deny']);
      document.body.classList.add(styles['body-window-scroll-deny']);
      document.body.style.top = `-${latestScrollYRef.current}px`;
      document.body.style.left = `-${latestScrollXRef.current}px`;
    }
    setScrollState('deny');
  }, [ref]);

  const allowScroll = useCallback(() => {
    if (ref !== undefined && ref.current !== null) {
      ref.current.classList.remove(styles['scroll-target-scroll-block']);
      ref.current.style.removeProperty('top');
      ref.current.style.removeProperty('left');
      ref.current.scrollTo({
        top: latestScrollTargetYRef.current,
        left: latestScrollTargetXRef.current,
      });
    } else {
      document.querySelector('html')?.classList.remove(styles['html-window-scroll-deny']);
      document.body.classList.remove(styles['body-window-scroll-deny']);
      document.body.style.removeProperty('top');
      document.body.style.removeProperty('left');
      window.scrollTo({
        top: latestScrollYRef.current,
        left: latestScrollXRef.current,
      });
    }
    setScrollState('allow');
  }, [ref]);

  const denyTextDrag = useCallback(() => {
    if (ref !== undefined && ref.current !== null) {
      ref.current.classList.add(styles['no-text-drag']);
    } else {
      document.body.classList.add(styles['no-text-drag']);
    } 
    setTextDragState('deny');
  }, [ref]);

  const allowTextDrag = useCallback(() => {
    if (ref !== undefined && ref.current !== null) {
      ref.current.classList.remove(styles['no-text-drag']);
    } else {
      document.body.classList.remove(styles['no-text-drag']);
    }
    setTextDragState('allow');
  }, [ref]);

  // const getScrollState = useCallback((): 'allow' | 'deny' => {
  //   if (ref !== undefined && ref.current !== null) {
  //     return ref.current.classList.contains(styles['scroll-target-scroll-block']) ? 'deny' : 'allow';
  //   } else {
  //     return document.body.classList.contains(styles['html-window-scroll-deny']) ? 'deny' : 'allow';
  //   }
  // }, [ref]);

  // const getTextDragState = useCallback((): 'allow' | 'deny' => {
  //   if (ref !== undefined && ref.current !== null) {
  //     return ref.current.classList.contains(styles['no-text-drag']) ? 'deny' : 'allow';
  //   } else {
  //     return document.body.classList.contains(styles['no-text-drag']) ? 'deny' : 'allow';
  //   }
  // }, [ref]);

  return {
    denyScroll,
    allowScroll,
    scrollState,

    denyTextDrag,
    allowTextDrag,
    textDragState,
  };
}