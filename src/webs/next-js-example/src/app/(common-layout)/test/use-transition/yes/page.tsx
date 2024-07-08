"use client";

import { useState, useTransition } from "react";
import { Apple } from "@/components/test/apple/apple.component";
import { Banana } from "@/components/test/banana/banana.component";
import { Melon } from "@/components/test/melon/melon.component";

export default function Page() {
  const [isPending, startTransition] = useTransition();
  const [tabItems, setTabItems] = useState([
    { name: 'apple', value: 'apple' },
    { name: 'banana', value: 'banana' },
    { name: 'melon', value: 'melon' },
  ]);
  const [tab, setTab] = useState(tabItems.at(0)?.value);

  return (
    <>
      <div className="w-full relative">
        isPending : { isPending ? 'true' : 'false'}
      </div>
      <ul className="w-full relative flex flex-rwap gap-2">
        {
          tabItems.map((item, index) => {
            return (
              <li key={item.value + '_' + index} className="inline-flex">
                <button onClick={() => {
                  startTransition(() => {
                    setTab(item.value);
                  });
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
        { tab === 'banana' ? <Banana /> : null }
        { tab === 'melon' ? <Melon /> : null }
      </div>
    </>
  );
}