import { IScrollEffect } from '../../components';

export declare namespace IUseScrollEffectManager {
  export type ScrolledInfo = {
    timestamp: number;
  };

  export type WrapperElementItem = {
    id: string;
    element: HTMLDivElement;
    childParams: IScrollEffect.ChildParams;
    compProps: IScrollEffect.Props;
  };

  export type OnScrollParams = {
    wrapperElementMap: Map<string, WrapperElementItem>;
  };

  export type Props = {
    onScroll?: (params: OnScrollParams) => void;
  };
}
