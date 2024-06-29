export declare namespace IJoystick {
  export type PressKey = 
    'ArrowUp' | 
    'ArrowRight' | 
    'ArrowDown' | 
    'ArrowLeft'
  ;  

  export interface Coordinate {
    x: number;
    y: number;
  }

  export interface Ids {
    joystickContainerId?: string;
    joystickHandlerId?: string;
  }

  export interface Classes {
    joystickContainerClassName?: string;
    joystickHandlerClassName?: string;
  }

  export interface Props {
    ids?: Ids;
    classes?: Classes;
    onPressed?: (pressKeys: PressKey[], isStrength: boolean) => void;
    onPressOut?: () => void;
  }
}