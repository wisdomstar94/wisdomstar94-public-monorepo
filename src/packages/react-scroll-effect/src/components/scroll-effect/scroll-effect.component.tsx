import { FC, useEffect, useRef } from 'react';
import { IScrollEffect } from './scroll-effect.types';

export const ScrollEffect: FC<IScrollEffect.Props> = (props) => {
  const { wrapperClassName, wrapperStyle, child, onChangeScrollParams, onWrapperElement, childParams } = props;
  const divRef = useRef<HTMLDivElement>();

  useEffect(() => {
    onChangeScrollParams && onChangeScrollParams(childParams);
  }, [childParams]);

  return (
    <div
      ref={(r) => {
        r && (divRef.current = r);
        onWrapperElement && r && onWrapperElement(r);
      }}
      className={wrapperClassName}
      style={wrapperStyle}
    >
      {child(childParams)}
    </div>
  );
};
