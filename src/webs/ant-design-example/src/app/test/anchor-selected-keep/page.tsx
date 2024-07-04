"use client";

import { Anchor } from "antd";
import { useEffect, useState } from "react";

export default function Page() {
  const [currentHash, setCurrentHash] = useState<string>('');

  useEffect(() => {
    setCurrentHash(location.hash);
  }, []); 

  return (
    <>
      {/* 스크롤 하면 선택되어 있던 앵커가 선택 해제됨. */}
      <Anchor
        // affix={false}
        // replace
        onChange={(hash) => {
          console.log('@hash', hash);
          setCurrentHash(hash);
        }}
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
      <div id="components-anchor-demo-basic" style={{ width: '100%', height: 500 }}>1</div>
      <div id="components-anchor-demo-static" style={{ width: '100%', height: 500 }}>2</div>
      <div id="api" style={{ width: '100%', height: 500 }}>3</div>
      <div style={{ width: '100%', height: 3500 }}>4</div>
    </>
  );
}
