import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";
import { ITouchContainer } from "./touch-container.interface";
import { useRef } from "react";

export function TouchContainer(props: ITouchContainer.Props) {
  const {
    onTouchStart,
    onTouchEnd,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const isPressingRef = useRef(false);
  const touchTypeRef = useRef<ITouchContainer.PressType>();

  function isExistContainerElement(touch: Touch) {
    const target = touch.target as HTMLElement;
    // console.log('@target', target);

    if (target === null) return false;

    let checkTargetElement: HTMLElement | null = target;
    while(checkTargetElement !== null && checkTargetElement !== undefined) {
      if (checkTargetElement === containerRef.current) {
        return true;
      }
      checkTargetElement = checkTargetElement.parentElement;
    }

    return false;
  }

  function getTouchMatchContainer(event: TouchEvent) {
    const touches = Array.from(event.touches);
    // console.log('touches', touches);
    const touch = touches.find(t => {
      const isExist = isExistContainerElement(t);
      // console.log(`isExistContainerElement(t)`, isExist);
      return isExist;
    });
    return touch;
  }

  function onPress(event: MouseEvent | TouchEvent) {
    // console.log('@onPress', event);

    if (isPressingRef.current) return;

    let touch: Touch | undefined;
    if (event instanceof MouseEvent) {
      if (touchTypeRef.current === undefined) {
        touchTypeRef.current = 'mouse';
      }
      if (touchTypeRef.current === 'touch') {
        return;
      }
    } else {
      if (touchTypeRef.current === undefined) {
        touchTypeRef.current = 'touch';
      }
      // console.log('@onPress.event.touches', event.touches);
      touch = getTouchMatchContainer(event);
      if (touch === undefined) return;
    }

    // console.log('@onPress', touch);

    const container = containerRef.current;
    if (container === null) return;

    let clientX = 0;
    let clientY = 0;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      clientX = touch!.clientX;
      clientY = touch!.clientY;
    }

    const bounds = container.getBoundingClientRect();
    const isContain = (bounds.x <= clientX && bounds.x + bounds.width >= clientX) && (bounds.y <= clientY && bounds.y + bounds.height >= clientY);
    if (!isContain) return;

    isPressingRef.current = true;
    if (typeof onTouchStart === 'function') onTouchStart(event);
  }

  function onPressOut(event?: MouseEvent | TouchEvent) {
    if (!isPressingRef.current) return;
    if (!(event instanceof MouseEvent) && event !== undefined) {
      const touches = Array.from(event.touches);
      const touch = touches.find(x => isExistContainerElement(x));
      if (touch !== undefined) return;
    }

    isPressingRef.current = false;
    if (typeof onTouchEnd === 'function') onTouchEnd(event);
  }

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'mousedown',
      eventListener(event) {
        onPress(event);
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'touchstart',
      eventListener(event) {
        onPress(event);
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'mouseup',
      eventListener(event) {
        onPressOut(event);
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'touchend',
      eventListener(event) {
        onPressOut(event);
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'blur',
      eventListener(event) {
        onPressOut();
      },
    },
  });

  return (
    <>
      <div className={props.className} ref={containerRef}>
        { props.children }
      </div>
    </>
  );
}