import { ReactNode } from "react";

export declare namespace ITouchContainer {
  export type PressType = 'mouse' | 'touch';

  export interface Props {
    className?: string;
    children?: ReactNode;
    onTouchStart?: (event: MouseEvent | TouchEvent) => void;
    onTouchEnd?: (event?: MouseEvent | TouchEvent) => void;
  }
}