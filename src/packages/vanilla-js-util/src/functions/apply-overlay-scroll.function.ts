import { applyClassNameToElement } from './apply-class-name-to-element.function';
import { getPercentage } from './get-percentage.function';
import { getUniqueToken } from './get-unique-token.function';

export type ApplyOverlayScrollParams<T> = {
  target: T;
  width?: number;
  padding?: number;
  scrollBarClassName?: string;
  scrollEndedHideDelay?: number;
  isRoot?: boolean;
};

export type ApplyOverlayScrollResult = {
  isSuccess: boolean;
  cleanup: () => void;
};

type GetOverlayElementParams<T> = {
  width: number;
  padding: number;
  target: T;
  scrollBarClassName?: string;
  isRoot: boolean;
};

/**
 * params.target 을 인자로 넘길 때 target 요소의 사이즈는 100% 로 잡고, 부모 요소에 사이즈가 지정되어 있는 구조여야 합니다.
 * ```
 * <div className="w-[600px] h-[600px] relative">
 *     <div className="w-full h-full" data-description="this is a target element!">
 *
 *     </div>
 * </div>
 * ```
 */
export function applyOverlayScroll<T extends HTMLElement>(params: ApplyOverlayScrollParams<T>): ApplyOverlayScrollResult {
  const { target, width = 8, padding = 3, scrollBarClassName, scrollEndedHideDelay = 300, isRoot = false } = params;

  const head = document.querySelector<HTMLElement>('head');
  if (head === null) {
    return { isSuccess: false, cleanup: () => {} };
  }

  const className = `class-${getUniqueToken(20)}`;
  target.classList.add(className);

  const style = document.createElement('style');
  style.innerHTML = `
    .${className} {
      overflow-y: scroll;
    }
    .${className}::-webkit-scrollbar {
      width: 0px;
    }

    .${className} ~ .overlay-scrollbar-container {
      opacity: 0;
      transition: 0.3s all;
    }

    .${className} ${isRoot ? '' : '~ '}.overlay-scrollbar-container.show-overlay-scrollbar {
      /* animation: ${className}-show 0.3s ease-out 0ms 1 normal both; */
      opacity: 1;
    } 
    .${className} ${isRoot ? '' : '~ '}.overlay-scrollbar-container.hide-overlay-scrollbar {
      /* animation: ${className}-hide 0.3s ease-out 0ms 1 normal both; */
      opacity: 0;
    } 

    @keyframes ${className}-show {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes ${className}-hide {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  `;

  head.appendChild(style);

  const { wrapperDiv, wrapperDiv2, div } = getOverlayElement({ target, width, padding, scrollBarClassName, isRoot });

  if (isRoot) {
    target?.appendChild(wrapperDiv);
  } else {
    target.parentElement?.appendChild(wrapperDiv);
  }

  let hideTimeout: NodeJS.Timeout | undefined;

  const disappearScrollBar = () => {
    clearTimeout(hideTimeout);
    if (!wrapperDiv.classList.contains('hide-overlay-scrollbar')) {
      wrapperDiv.classList.remove('show-overlay-scrollbar');
      wrapperDiv.classList.add('hide-overlay-scrollbar');
    }
  };

  const appearScrollBar = () => {
    clearTimeout(hideTimeout);
    const { scrollBarAbsoluteTop } = getTargetInfo(target, padding, isRoot);
    div.style.top = `${scrollBarAbsoluteTop}px`;

    if (!wrapperDiv.classList.contains('show-overlay-scrollbar')) {
      wrapperDiv.classList.remove('hide-overlay-scrollbar');
      wrapperDiv.classList.add('show-overlay-scrollbar');
    }
  };

  const disappearScrollBarTimeout = () => {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      disappearScrollBar();
    }, scrollEndedHideDelay);
  };

  const eventTarget = isRoot ? window : target;

  eventTarget.addEventListener('scroll', () => {
    appearScrollBar();
  });

  eventTarget.addEventListener('scrollend', () => {
    disappearScrollBarTimeout();
  });

  eventTarget.addEventListener('mouseover', () => {
    appearScrollBar();
  });

  eventTarget.addEventListener('mouseout', () => {
    disappearScrollBar();
  });

  eventTarget.addEventListener('mouseover', () => {
    const clientHeight = isRoot ? window.innerHeight : target.clientHeight;
    const scrollHeight = isRoot ? document.body.clientHeight : target.scrollHeight;

    if (clientHeight >= scrollHeight) {
      wrapperDiv.style.visibility = 'hidden';
    } else {
      wrapperDiv.style.visibility = 'visible';
    }
  });

  return {
    isSuccess: true,
    cleanup() {
      style.remove();
      div.remove();
      wrapperDiv2.remove();
      wrapperDiv.remove();
    },
  };
}

function getTargetInfo<T extends HTMLElement>(target: T, padding: number, isRoot: boolean) {
  const scrollHeight = isRoot ? document.body.clientHeight : target.scrollHeight;
  const clientHeight = isRoot ? window.innerHeight : target.clientHeight;
  const percentage = getPercentage(scrollHeight, clientHeight);

  const maxScrollTop = scrollHeight - clientHeight;
  const currentScrollTop = isRoot ? window.scrollY : target.scrollTop;
  const scrollTopPercentage = getPercentage(maxScrollTop, currentScrollTop);

  const scrollBarMaxHeight = clientHeight - padding * 2;
  const scrollBarHeight = scrollBarMaxHeight * (percentage / 100);

  const scrollBarMaxAbsoluteTop = clientHeight - padding * 2 - scrollBarHeight;
  const scrollBarAbsoluteTop = scrollBarMaxAbsoluteTop * (scrollTopPercentage / 100);

  return {
    maxScrollTop,
    currentScrollTop,
    scrollBarHeight,
    scrollTopPercentage,
    scrollBarAbsoluteTop,
  };
}

function getOverlayElement<T extends HTMLElement>(params: GetOverlayElementParams<T>) {
  const { target, width, padding, scrollBarClassName, isRoot } = params;

  const { scrollBarHeight } = getTargetInfo(target, padding, isRoot);

  const wrapperDiv = document.createElement('div');
  wrapperDiv.style.width = `${width}px`;
  wrapperDiv.style.boxSizing = 'border-box';
  wrapperDiv.style.height = isRoot ? '100vh' : '100%';
  wrapperDiv.style.position = isRoot ? 'fixed' : 'absolute';
  wrapperDiv.style.top = '0';
  wrapperDiv.style.right = '0';
  wrapperDiv.style.padding = `${padding}px`;
  wrapperDiv.style.zIndex = '4';
  wrapperDiv.classList.add('overlay-scrollbar-container');

  const wrapperDiv2 = document.createElement('div');
  wrapperDiv.appendChild(wrapperDiv2);
  wrapperDiv2.style.width = '100%';
  wrapperDiv2.style.height = '100%';
  wrapperDiv2.style.position = 'relative';

  const div = document.createElement('div');
  wrapperDiv2.appendChild(div);
  applyClassNameToElement(div, scrollBarClassName);
  div.style.width = '100%';
  div.style.height = `${scrollBarHeight}px`;
  if (typeof scrollBarClassName !== 'string') {
    div.style.backgroundColor = '#000';
  }
  div.style.position = 'absolute';
  div.style.top = '0';
  div.style.left = '0';

  const eventTarget = isRoot ? window : target;

  eventTarget.addEventListener('mouseover', () => {
    const { scrollBarHeight } = getTargetInfo(target, padding, isRoot);
    div.style.height = `${scrollBarHeight}px`;
  });

  return { wrapperDiv, wrapperDiv2, div };
}
