export type PositionType = 'top' | 'bottom' | 'left' | 'right';
export type PositionAlign = 'start' | 'center' | 'end';

export type PositionOption = {
  type: PositionType;
  align: PositionAlign;
};

// export type MarginOption = {
//   top?: number;
//   left?: number;
//   right?: number;
//   bottom?: number;
// };

export type SetPositionTargetElementParams<T extends HTMLElement> = {
  from: T;
  to: T;
  positionOption?: PositionOption;
  margin?: number;
};

export function setPositionTargetElement<T extends HTMLElement>(params: SetPositionTargetElementParams<T>) {
  const { from, to, positionOption = { type: 'right', align: 'center' }, margin = 0 } = params;

  const toInfo = getElementInfo(to);
  const fromInfo = getElementInfo(from);
  const positionValues = getPositionValues(toInfo, fromInfo, positionOption, margin);
  from.style.position = 'fixed';
  from.style.opacity = '1';
  from.style.visibility = 'visible';
  from.style.top = `${positionValues.top}px`;
  from.style.left = `${positionValues.left}px`;
}

function getElementInfo<T extends HTMLElement>(element: T) {
  const rect = element.getBoundingClientRect();

  return {
    rect,
  };
}

function getPositionValues(
  toInfo: ReturnType<typeof getElementInfo>,
  fromInfo: ReturnType<typeof getElementInfo>,
  positionOption: PositionOption,
  margin: number
) {
  const elementWidth = toInfo.rect.width;
  const elementHeight = toInfo.rect.height;
  const elementX = toInfo.rect.x;
  const elementY = toInfo.rect.y;
  const elementXEnd = elementX + elementWidth;
  const elementYEnd = elementY + elementHeight;

  let top = 0;
  let left = 0;

  switch (positionOption.type) {
    case 'top':
      switch (positionOption.align) {
        case 'start':
          top = elementY - margin - fromInfo.rect.height;
          left = elementX;
          break;
        case 'center':
          top = elementY - margin - fromInfo.rect.height;
          left = elementX - fromInfo.rect.width / 2 + elementWidth / 2;
          break;
        case 'end':
          top = elementY - margin - fromInfo.rect.height;
          left = elementX + elementWidth - fromInfo.rect.width;
          break;
      }
      break;
    case 'left':
      switch (positionOption.align) {
        case 'start':
          top = elementY;
          left = elementX - margin - fromInfo.rect.width;
          break;
        case 'center':
          top = elementY - fromInfo.rect.height / 2 + elementHeight / 2;
          left = elementX - margin - fromInfo.rect.width;
          break;
        case 'end':
          top = elementY + elementHeight - fromInfo.rect.height;
          left = elementX - margin - fromInfo.rect.width;
          break;
      }
      break;
    case 'right':
      switch (positionOption.align) {
        case 'start':
          top = elementY;
          left = elementXEnd + margin;
          break;
        case 'center':
          top = elementY - fromInfo.rect.height / 2 + elementHeight / 2;
          left = elementXEnd + margin;
          break;
        case 'end':
          top = elementY + elementHeight - fromInfo.rect.height;
          left = elementXEnd + margin;
          break;
      }
      break;
    case 'bottom':
      switch (positionOption.align) {
        case 'start':
          top = elementYEnd + margin;
          left = elementX;
          break;
        case 'center':
          top = elementYEnd + margin;
          left = elementX - fromInfo.rect.width / 2 + elementWidth / 2;
          break;
        case 'end':
          top = elementYEnd + margin;
          left = elementX + elementWidth - fromInfo.rect.width;
          break;
      }
      break;
  }

  return {
    top,
    left,
  };
}
