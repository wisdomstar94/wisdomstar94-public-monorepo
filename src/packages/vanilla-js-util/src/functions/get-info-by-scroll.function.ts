import { getPercentage } from './get-percentage.function';

export function getInfoByScroll<T extends HTMLElement>(element: T) {
  const rect = element.getBoundingClientRect();
  const elementY = rect.y;
  const scrollContainerHeight = window.innerHeight;

  let firstTopLastBottomHideFactor = 0;
  let firstBottomLastTopHideFactor = 0;
  let isFullVisible = false;

  if (elementY < 0) {
    const firstTopLastBottomHidePercentage = getPercentage(rect.height, -elementY);
    // console.log('@firstTopLastBottomHidePercentage', firstTopLastBottomHidePercentage);
    firstTopLastBottomHideFactor = 1 * (firstTopLastBottomHidePercentage / 100);
    if (firstTopLastBottomHideFactor >= 1) firstTopLastBottomHideFactor = 1;
  } else if (elementY > scrollContainerHeight - rect.height) {
    const firstBottomLastTopHidePercentage = getPercentage(rect.height, elementY - (scrollContainerHeight - rect.height));
    // console.log('@firstBottomLastTopHidePercentage', firstBottomLastTopHidePercentage);
    firstBottomLastTopHideFactor = 1 * (firstBottomLastTopHidePercentage / 100);
    if (firstBottomLastTopHideFactor >= 1) firstBottomLastTopHideFactor = 1;
  } else {
    isFullVisible = true;
  }

  return {
    rect,
    firstTopLastBottomHideFactor,
    firstBottomLastTopHideFactor,
    isFullVisible,
  };
}
