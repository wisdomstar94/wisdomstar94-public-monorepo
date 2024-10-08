import { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react';

export type VerticalTabItemType<T extends string = string> = {
  key: T;
  buttonRender: ReactNode;
  contentRender: ReactNode;
};

export type VerticalTabPropsType<T extends string = string> = {
  showKey: T | undefined;
  setShowKey: Dispatch<SetStateAction<T | undefined>>;
  items: VerticalTabItemType<T>[];
  layoutRenderer?: (tabButtonArea: ReactNode, tabContentArea: ReactNode) => ReactNode;
};

export function VerticalTab<T extends string = string>({ showKey, setShowKey, items, layoutRenderer }: VerticalTabPropsType<T>) {
  const tabButtonArea = (
    <>
      <ul className="w-full flex flex-wrap gap-2 relative">
        {items.map((item) => {
          return (
            <li className={`w-full relative group/vertical-tab-item`} key={'tab_button_' + item.key}>
              <button
                className={`w-full box-border px-5 py-2 relative flex cursor-pointer ${showKey === item.key ? 'tab-button-active' : ''}`}
                onClick={() => {
                  setShowKey(item.key);
                }}
              >
                {/* bg */}
                <div className="bg-neutral-500/10 w-full h-full absolute top-0 left-0 hidden group-hover/vertical-tab-item:flex group-has-[.tab-button-active]/vertical-tab-item:flex" />
                {/* render */}
                {item.buttonRender}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );

  const tabContentArea = (
    <>
      <ul className="w-full flex relative gap-2">
        {items.map((item) => {
          return (
            <li key={'tab_content_' + item.key} className={`w-full relative ${showKey === item.key ? 'flex' : 'hidden'}`}>
              {item.contentRender}
            </li>
          );
        })}
      </ul>
    </>
  );

  // 사용하는 측에서 탭 버튼의 위치와 탭 내용의 위치를 자유롭게 커스텀 할 수 있도록 렌더러를 제공합니다.
  if (typeof layoutRenderer === 'function') {
    return <>{layoutRenderer(tabButtonArea, tabContentArea)}</>;
  }

  // 렌더러가 제공되지 않았을 경우에는 기본 레이아웃으로 제공합니다.
  return (
    <>
      <div className="w-full flex gap-2 relative flex-col md:flex-row">
        <div className="w-full md:w-[280px] flex-grow-0 flex-shrink-0 relative">{tabButtonArea}</div>
        <div className="w-full min-w-0 relative">{tabContentArea}</div>
      </div>
    </>
  );
}
