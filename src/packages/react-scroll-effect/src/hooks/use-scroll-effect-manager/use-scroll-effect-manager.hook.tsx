import { useLayoutEffect, useRef, useState } from 'react';
import { IScrollEffect, ScrollEffect } from '../../components';
import { IUseScrollEffectManager } from './use-scroll-effect-manager.types';
import { useAddEventListener } from '@wisdomstar94/react-add-event-listener';
import { scaleLinear } from 'd3';

export function useScrollEffectManager(props?: IUseScrollEffectManager.Props) {
  const { onScroll } = props ?? {};

  const wrapperElementMap = useRef<Map<string, IUseScrollEffectManager.WrapperElementItem>>(new Map());
  const [scrolledInfo, setScrolledInfo] = useState<IUseScrollEffectManager.ScrolledInfo>();
  const [isReady, setIsReady] = useState(false);

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'scroll',
      eventListener(event) {
        handleScroll();
      },
    },
  });

  function handleScroll() {
    for (const [id, wrapperElementItem] of Array.from(wrapperElementMap.current)) {
      const newChildParams = getNewChildParams(wrapperElementItem);
      wrapperElementItem.childParams = newChildParams;
    }
    onScroll && onScroll({ wrapperElementMap: wrapperElementMap.current });
    // scrolledInfo;
    setScrolledInfo({ timestamp: Date.now() });
  }

  function getNewChildParams(wrapperElementItem: IUseScrollEffectManager.WrapperElementItem) {
    const newChildParams: IScrollEffect.ChildParams = (function () {
      const { childParams, compProps } = wrapperElementItem;
      const result: IScrollEffect.ChildParams = { ...childParams };

      if (typeof document === 'undefined') return result;

      const scrollContainerHeight = window.innerHeight;

      const div = wrapperElementItem.element;
      if (div === undefined) return result;

      const showAreaReactionSensitive = { compProps };

      result.scrollHeight = window.scrollY;

      const divRect = div.getBoundingClientRect();
      result.boundingClientRect = divRect;

      const divHeight = divRect.height;

      let divShowStartY = scrollContainerHeight;
      const divShowEndY = divShowStartY - divHeight;

      if (!isNaN(Number(showAreaReactionSensitive)) && typeof showAreaReactionSensitive === 'number') {
        divShowStartY += showAreaReactionSensitive;
      }

      const divBottomAppearOrDissapearStartY = divShowEndY; // ex) -45
      const divBottomAppearOrDissapearEndY = divBottomAppearOrDissapearStartY - scrollContainerHeight; // ex) -567

      result.factorMode = divBottomAppearOrDissapearStartY > divRect.y ? 'BOTTOM_APPEAR_OR_DISSPEAR' : 'TOP_APPEAR_OR_DISSAPEAR';

      const condition1 = divRect.y >= divShowEndY && divRect.y <= divShowStartY;
      const condition2 = divRect.y <= scrollContainerHeight && divRect.y >= 0;
      const condition3 = divRect.y <= 0 && divRect.y >= divRect.height;
      const condition4 = divRect.y >= divBottomAppearOrDissapearEndY && divRect.y <= divBottomAppearOrDissapearStartY;
      result.isContainShowArea = condition1 || condition2 || condition3 || condition4;

      if (result.isContainShowArea) {
        result.isHaveDoneContainShowArea = true;
      }

      let linear = scaleLinear().domain([divShowStartY, divShowEndY]).range([0, 1]);
      if (result.factorMode === 'BOTTOM_APPEAR_OR_DISSPEAR') {
        result.isHaveDoneFactorFulled = true;
        linear = scaleLinear().domain([divBottomAppearOrDissapearStartY, divBottomAppearOrDissapearEndY]).range([1, 0]);
      }

      result.factor = linear(divRect.y);
      if (result.factor >= 1) {
        result.factor = 1;
      }
      if (result.factor <= 0) {
        result.factor = 0;
      }

      return result;
    })();
    return newChildParams;
  }

  useLayoutEffect(() => {
    handleScroll();
    setIsReady(true);
  }, []);

  return {
    scrolledInfo,
    isReady,
    scrollEffectComponent: (compProps: IScrollEffect.Props) => {
      const { id } = compProps;
      return (
        <ScrollEffect
          {...compProps}
          onWrapperElement={(element) => {
            wrapperElementMap.current.set(id, {
              id,
              element,
              compProps,
              childParams: {
                scrollHeight: 0,
                factor: 0,
                factorMode: 'TOP_APPEAR_OR_DISSAPEAR',
                isHaveDoneFactorFulled: false,
                isContainShowArea: false,
                isHaveDoneContainShowArea: false,
                boundingClientRect: null,
              },
            });
          }}
          childParams={wrapperElementMap.current.get(id)?.childParams}
        />
      );
    },
  };
}
