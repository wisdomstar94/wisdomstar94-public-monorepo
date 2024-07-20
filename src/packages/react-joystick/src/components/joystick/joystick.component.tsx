import { CSSProperties, useRef, useState } from "react";
import { IJoystick } from "./joystick.interface";
import styles from "./joystick.module.css";
import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";
import { getTwoPointDistance } from "@/libs/utils";

export function Joystick(props: IJoystick.Props) {
  const {
    onPressed,
    onPressOut,
    classes,
    ids,
  } = props;

  const handlerContainerElementRef = useRef<HTMLDivElement>(null);
  const handlerElementRef = useRef<HTMLDivElement>(null);

  const isJoystickPressed = useRef<boolean>(false);
  const pressedCoordinate = useRef<IJoystick.Coordinate>({ x: 0, y: 0 });
  const movedCoordinate = useRef<IJoystick.Coordinate>({ x: 0, y: 0 });
  const [handlerTransformState, setHandlerTransformState] = useState<string>();

  const isTouchEventEmitedRef = useRef(false);

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'resize',
      eventListener(event) {
        isTouchEventEmitedRef.current = false;
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'mousedown',
      eventListener(event) {
        joystickPressed(event);
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'touchstart',
      eventListener(event) {
        joystickPressed(event);
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'mousemove',
      eventListener(event) {
        joystickMoved(event);
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'touchmove',
      eventListener(event) {
        joystickMoved(event);
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'mouseup',
      eventListener(event) {
        joystickHandOuted(event);
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'touchend',
      eventListener(event) {
        joystickHandOuted(event);
      },
    },
  });

  function getHandlerTouchItem(event: TouchEvent) {
    const touches = Array.from(event.touches);
    const touch = touches.find(x => x.target === handlerElementRef.current || x.target === handlerContainerElementRef.current);
    return touch;
  }

  function calculateDistance(event: MouseEvent | TouchEvent): IJoystick.Coordinate {
    let x = 0;
    let y = 0;

    if (event instanceof MouseEvent) {
      x = event.clientX - pressedCoordinate.current.x;
      y = event.clientY - pressedCoordinate.current.y;
    } else {
      const touch = getHandlerTouchItem(event);
      if (touch === undefined) throw new Error('핸들러 요소를 찾을 수 없습니다.');

      x = touch.clientX - pressedCoordinate.current.x;
      y = touch.clientY - pressedCoordinate.current.y;
    }

    return {
      x, 
      y,
    };
  }

  function joystickPressed(event: MouseEvent | TouchEvent) {
    if (!(event instanceof MouseEvent)) {
      isTouchEventEmitedRef.current = true;
    }

    if (isJoystickPressed.current) return;
    // console.log('@joystickPressed.event', event);

    const handlerElement = handlerElementRef.current;
    if (handlerElement === null) return;

    const handlerContainerElement = handlerContainerElementRef.current;
    if (handlerContainerElement === null) return;

    if (event.target !== handlerElement && event.target !== handlerContainerElement) return;

    let clientX = 0;
    let clientY = 0;
  
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      const touch = getHandlerTouchItem(event);
      if (touch === undefined) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
    }

    const handlerBounds = handlerElement.getBoundingClientRect();
    const isContained = (handlerBounds.x <= clientX && handlerBounds.x + handlerBounds.width >= clientX) && (handlerBounds.y <= clientY && handlerBounds.y + handlerBounds.height >= clientY);
    if (!isContained) {
      return;
    }

    isJoystickPressed.current = true;
    pressedCoordinate.current.x = clientX;
    pressedCoordinate.current.y = clientY;
  }

  function joystickMoved(event: MouseEvent | TouchEvent) {
    if (!isJoystickPressed.current) {
      return;
    }
    // console.log('@joystickMoved.event', event);

    let clientX = 0;
    let clientY = 0;
  
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
      if (isTouchEventEmitedRef.current) return;
    } else {
      const touch = getHandlerTouchItem(event);
      if (touch === undefined) throw new Error('핸들러 요소를 찾을 수 없습니다.');
      clientX = touch.clientX;
      clientY = touch.clientY;
    }

    movedCoordinate.current.x = clientX;
    movedCoordinate.current.y = clientY;

    const distanceCoordinate = calculateDistance(event);
    const maxValue = 40;
    let x = distanceCoordinate.x;
    let y = distanceCoordinate.y;
    if (x < -maxValue) {
      x = -maxValue;
    } else if (x > maxValue) {
      x = maxValue;
    }
    if (y < -maxValue) {
      y = -maxValue;
    } else if (y > maxValue) {
      y = maxValue;
    }
    setHandlerTransformState(`translateX(${x}px) translateY(${y}px)`);

    const radian = Math.atan2(pressedCoordinate.current.y - movedCoordinate.current.y, pressedCoordinate.current.x - movedCoordinate.current.x);
    const angle = radian * (180 / Math.PI);
    const distance = getTwoPointDistance(pressedCoordinate.current, movedCoordinate.current);

    let pressKeys: IJoystick.PressKey[] = [];
    // calculate direction
    if (65 <= angle && angle < 115) {
      // ArrowUp
      pressKeys = ['ArrowUp'];
    } else if (115 <= angle && angle < 155) {
      // ArrowUp + ArrowRight
      pressKeys = ['ArrowUp', 'ArrowRight'];
    } else if (155 <= angle && angle <= 180) {
      // ArrowRight
      pressKeys = ['ArrowRight'];
    } else if (-180 <= angle && angle < -155) {
      // ArrowRight
      pressKeys = ['ArrowRight'];
    } else if (-155 <= angle && angle < -115) {
      // ArrowDown + ArrowRight
      pressKeys = ['ArrowDown', 'ArrowRight'];
    } else if (-115 <= angle && angle < -65) {
      // ArrowDown
      pressKeys = ['ArrowDown'];
    } else if (-65 <= angle && angle < -25) {
      // ArrowDown + ArrowLeft
      pressKeys = ['ArrowDown', 'ArrowLeft'];
    } else if (-25 <= angle && angle < 25) {
      // ArrowLeft
      pressKeys = ['ArrowLeft'];
    } else if (25 <= angle && angle < 65) {
      // ArrowUp + ArrowLeft
      pressKeys = ['ArrowUp', 'ArrowLeft'];
    }

    let isStrength = false;
    if (distance > 30) {
      isStrength = true;
    }

    if (typeof onPressed === 'function') {
      onPressed(pressKeys, isStrength);
    }
  }

  function joystickHandOuted(event: MouseEvent | TouchEvent) {
    if (event instanceof MouseEvent) {
      if (isTouchEventEmitedRef.current) return;
    } else {
      const touch = getHandlerTouchItem(event);
      if (touch !== undefined) return;  
    }
    // console.log('@joystickHandOuted.event', event);

    isJoystickPressed.current = false;

    setHandlerTransformState('translateX(0) translateY(0)');
    if (typeof onPressOut === 'function') {
      onPressOut();
    }
  }

  function handlerStyles() {
    let obj: CSSProperties = {};
    
    if (typeof handlerTransformState === 'string') {
      obj.transform = handlerTransformState;
    }

    return obj;
  }

  return (
    <>
      <div 
        id={ids?.joystickContainerId}
        className={[
          styles['joystick-container'],
          classes?.joystickContainerClassName ?? '',
        ].join(' ')}>
        <div 
          className={[
            styles['background']
          ].join(' ')}>

        </div>
        <div 
          ref={handlerContainerElementRef}
          className={[
            styles['handler-container']
          ].join(' ')}>
          <div 
            id={ids?.joystickHandlerId}
            className={[
              styles['handler'],
              classes?.joystickHandlerClassName ?? '',
            ].join(' ')}
            ref={handlerElementRef}
            style={handlerStyles()}>

          </div>
        </div>
      </div>
    </>
  );
}