import { applyClassNameToElement } from './apply-class-name-to-element.function';
import { getPercentage } from './get-percentage.function';
import { getUniqueToken } from './get-unique-token.function';

export type ApplyOverlayScrollParams<T> = {
  target: T;
  width?: number;
  padding?: number;
  scrollBarClassName?: string;
  scrollEndedHideDelay?: number;
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
};

export function applyOverlayScroll<T extends HTMLElement>(params: ApplyOverlayScrollParams<T>): ApplyOverlayScrollResult {
  const { target, width = 8, padding = 3, scrollBarClassName, scrollEndedHideDelay = 300 } = params;

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

    .${className} ~ .overlay-scrollbar-container.show-overlay-scrollbar {
      /* animation: ${className}-show 0.3s ease-out 0ms 1 normal both; */
      opacity: 1;
    } 
    .${className} ~ .overlay-scrollbar-container.hide-overlay-scrollbar {
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

  const { wrapperDiv, wrapperDiv2, div } = getOverlayElement({ target, width, padding, scrollBarClassName });
  target.parentElement?.appendChild(wrapperDiv);

  let hideTimeout: NodeJS.Timeout | undefined;

  target.addEventListener('scroll', () => {
    clearTimeout(hideTimeout);
    const { scrollBarAbsoluteTop } = getTargetInfo(target, padding);
    div.style.top = `${scrollBarAbsoluteTop}px`;

    if (!wrapperDiv.classList.contains('show-overlay-scrollbar')) {
      wrapperDiv.classList.remove('hide-overlay-scrollbar');
      wrapperDiv.classList.add('show-overlay-scrollbar');
    }
  });

  target.addEventListener('scrollend', () => {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!wrapperDiv.classList.contains('hide-overlay-scrollbar')) {
        wrapperDiv.classList.remove('show-overlay-scrollbar');
        wrapperDiv.classList.add('hide-overlay-scrollbar');
      }
    }, scrollEndedHideDelay);
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

function getTargetInfo<T extends HTMLElement>(target: T, padding: number) {
  const scrollHeight = target.scrollHeight;
  const clientHeight = target.clientHeight;
  const percentage = getPercentage(scrollHeight, clientHeight);

  const maxScrollTop = scrollHeight - clientHeight;
  const currentScrollTop = target.scrollTop;
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
  const { target, width, padding, scrollBarClassName } = params;

  const { scrollBarHeight } = getTargetInfo(target, padding);

  const wrapperDiv = document.createElement('div');
  wrapperDiv.style.width = `${width}px`;
  wrapperDiv.style.boxSizing = 'border-box';
  wrapperDiv.style.height = '100%';
  wrapperDiv.style.position = 'absolute';
  wrapperDiv.style.top = '0';
  wrapperDiv.style.right = '0';
  wrapperDiv.style.padding = `${padding}px`;
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

  return { wrapperDiv, wrapperDiv2, div };
}
