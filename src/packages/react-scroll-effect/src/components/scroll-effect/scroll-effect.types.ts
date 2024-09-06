import { CSSProperties, ReactNode } from 'react';

export declare namespace IScrollEffect {
  export type FactorMode = 'TOP_APPEAR_OR_DISSAPEAR' | 'BOTTOM_APPEAR_OR_DISSPEAR';

  export interface ChildParams {
    scrollHeight: number;
    factor: number;
    factorMode: FactorMode;
    isHaveDoneFactorFulled: boolean;
    isContainShowArea: boolean;
    isHaveDoneContainShowArea: boolean;
    boundingClientRect: DOMRect | null;
  }

  export interface Props {
    id: string;
    wrapperClassName?: string;
    wrapperStyle?: CSSProperties;
    showAreaReactionSensitive?: number;
    onWrapperElement?: (wrapperElement: HTMLDivElement) => void;
    // offWrapperElement?: (wrapperElement: HTMLDivElement) => void;
    onChangeScrollParams?: (params: ChildParams | undefined) => void;
    child: (params: ChildParams | undefined) => ReactNode;
    childParams?: ChildParams;
  }
}
