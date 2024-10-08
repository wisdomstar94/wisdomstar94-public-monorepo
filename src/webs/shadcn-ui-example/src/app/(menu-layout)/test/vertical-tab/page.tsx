'use client';

import { VerticalTab, VerticalTabItemType } from '@/components/vertical-tab/vertical-tab.component';
import { FC, useState } from 'react';

const Page: FC = () => {
  const tabItems = [
    {
      key: 'content1' as const,
      buttonRender: 'content1',
      contentRender: 'content1.....',
    },
    {
      key: 'content2' as const,
      buttonRender: 'content2',
      contentRender: 'content2.....',
    },
    {
      key: 'content3' as const,
      buttonRender: 'content3',
      contentRender: 'content3.....',
    },
  ] satisfies VerticalTabItemType<string>[];

  const [showKey, setShowKey] = useState<(typeof tabItems)[number]['key'] | undefined>('content1');

  return (
    <>
      <div className="w-full relative">
        <VerticalTab showKey={showKey} setShowKey={setShowKey} items={tabItems} />
      </div>
    </>
  );
};

export default Page;
