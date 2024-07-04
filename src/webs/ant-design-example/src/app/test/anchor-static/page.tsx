"use client";

import { Anchor } from "antd";

export default function Page() {
  return (
    <>
      {/* 스크롤 하면 선택되어 있던 앵커가  */}
      <Anchor
        // affix={false}
        items={[
          {
            key: '1',
            href: '#components-anchor-demo-basic',
            title: 'Basic demo',
          },
          {
            key: '2',
            href: '#components-anchor-demo-static',
            title: 'Static demo',
          },
          {
            key: '3',
            href: '#api',
            title: 'API',
            children: [
              {
                key: '4',
                href: '#anchor-props',
                title: 'Anchor Props',
              },
              {
                key: '5',
                href: '#link-props',
                title: 'Link Props',
              },
            ],
          },
        ]}
      />
      <div style={{ width: '100%', height: 500 }}>1</div>
      <div style={{ width: '100%', height: 500 }}>2</div>
      <div style={{ width: '100%', height: 500 }}>3</div>
    </>
  );
}
