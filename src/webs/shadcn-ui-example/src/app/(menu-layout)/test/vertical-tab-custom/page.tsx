'use client';

import { VerticalTab, VerticalTabItemType } from '@/components/vertical-tab/vertical-tab.component';
import { FC, useState } from 'react';

const Page: FC = () => {
  const tabItems = [
    {
      key: 'content1' as const,
      buttonRender: <div className="w-full flex justify-end">content1</div>,
      contentRender: 'content1.....',
    },
    {
      key: 'content2' as const,
      buttonRender: <div className="w-full flex justify-end">content2</div>,
      contentRender: 'content2.....',
    },
    {
      key: 'content3' as const,
      buttonRender: <div className="w-full flex justify-end">content3</div>,
      contentRender: 'content3.....',
    },
  ] satisfies VerticalTabItemType<string>[];

  const [showKey, setShowKey] = useState<(typeof tabItems)[number]['key'] | undefined>('content1');

  return (
    <>
      <div className="w-full relative">
        <VerticalTab
          showKey={showKey}
          setShowKey={setShowKey}
          items={tabItems}
          layoutRenderer={(tabButtonArea, tabContentArea) => {
            return (
              <>
                <div className="w-full flex gap-2 relative">
                  <div className="w-full min-w-0 relative">{tabContentArea}</div>
                  <div className="w-[320px] relative flex-shrink-0 flex-grow-0">{tabButtonArea}</div>
                </div>
              </>
            );
          }}
        />
      </div>
    </>
  );
};

export default Page;
