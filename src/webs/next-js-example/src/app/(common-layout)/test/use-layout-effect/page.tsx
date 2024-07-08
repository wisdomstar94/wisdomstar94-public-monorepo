"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { Apple } from "@/components/test/apple/apple.component";
import { Melon } from "@/components/test/melon/melon.component";

export default function Page() {
  const [tabItems, setTabItems] = useState([
    { name: 'apple', value: 'apple' },
    { name: 'banana', value: 'banana' },
    { name: 'melon', value: 'melon' },
  ]);
  const [tab, setTab] = useState(tabItems.at(0)?.value);

  console.log(`[${Date.now()}] @render.tab`, tab);

  useEffect(() => {
    console.log(`[${Date.now()}] @useEffect.tab`, tab);

    return () => {
      console.log(`[${Date.now()}] @useEffect.cleanup.tab`, tab);
    };
  }, [tab]);

  useLayoutEffect(() => {
    console.log(`[${Date.now()}] @useLayoutEffect.tab`, tab);

    return () => {
      console.log(`[${Date.now()}] @useLayoutEffect.cleanup.tab`, tab);
    };
  }, [tab]);

  return (
    <>
      <div className="w-full relative">
        use-layout-effect
      </div>
      <ul className="w-full relative flex flex-rwap gap-2">
        {
          tabItems.map((item, index) => {
            return (
              <li key={item.value + '_' + index} className="inline-flex">
                <button onClick={() => {
                  setTab(item.value);
                }} className={`${item.value === tab ? 'bg-blue-300' : ''}`}>
                  { item.name }
                </button>
              </li>
            );
          })
        }
      </ul>
      <div className="w-full relative">
        { tab === 'apple' ? <Apple /> : null }
        { tab === 'banana' ? <>banana..</> : null }
        { tab === 'melon' ? <Melon /> : null }
      </div>
    </>
  );
}