import { FC, useEffect, useRef, useState } from 'react';
import { IScrollEffect } from './scroll-effect.types';
import { useAddEventListener } from '@wisdomstar94/react-add-event-listener';
import { scaleLinear } from 'd3';

export const ScrollEffect: FC<IScrollEffect.Props> = (props) => {
  const { id, wrapperClassName, wrapperStyle, showAreaReactionSensitive, child, onChangeScrollParams } = props;
  const divRef = useRef<HTMLDivElement>(null);

  const [childParams, setChildParams] = useState<IScrollEffect.ChildParams>({
    scrollHeight: 0,
    factor: 0,
    factorMode: 'TOP_APPEAR_OR_DISSAPEAR',
    isHaveDoneFactorFulled: false,
    isContainShowArea: false,
    isHaveDoneContainShowArea: false,
    boundingClientRect: null,
  });

  function consoleLog(message: any) {
    console.log(`[${id}]`, message);
  }

  function onScroll() {
    const newChildParams: IScrollEffect.ChildParams = (function () {
      const result: IScrollEffect.ChildParams = { ...childParams };

      if (typeof document === 'undefined') return result;

      const scrollContainerHeight = window.innerHeight;

      const div = divRef.current;
      if (div === null) return result;

      result.scrollHeight = window.scrollY;

      const divRect = div.getBoundingClientRect();
      result.boundingClientRect = divRect;

      const divHeight = divRect.height;

      let divShowStartY = scrollContainerHeight;
      const divShowEndY = divShowStartY - divHeight;

      if (!isNaN(Number(showAreaReactionSensitive)) && typeof showAreaReactionSensitive === 'number') {
        divShowStartY += showAreaReactionSensitive;
      }
      // divShowStartY > divShowEndY;

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

      // consoleLog(`@divShowEndY: ` + divShowEndY);
      // consoleLog(`@divShowStartY: ` + divShowStartY);
      // consoleLog(`@divBottomAppearOrDissapearStartY: ` + divBottomAppearOrDissapearStartY);
      // consoleLog(`@divBottomAppearOrDissapearEndY: ` + divBottomAppearOrDissapearEndY);
      // consoleLog(`@divRect.y: ` + divRect.y);
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
    setChildParams(newChildParams);
  }

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'scroll',
      eventListener(event) {
        onScroll();
      },
    },
  });

  useEffect(() => {
    onScroll();
  }, []);

  useEffect(() => {
    onChangeScrollParams && onChangeScrollParams(childParams);
  }, [childParams]);

  return (
    <div ref={divRef} className={wrapperClassName} style={wrapperStyle}>
      {child(childParams)}
    </div>
  );
};
