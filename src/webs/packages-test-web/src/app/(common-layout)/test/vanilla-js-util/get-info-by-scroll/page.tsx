'use client';

import { useAddEventListener } from '@wisdomstar94/react-add-event-listener';
import { getInfoByScroll } from '@wisdomstar94/vanilla-js-util';
import { useRef } from 'react';

export default function Page() {
  const divRef = useRef<HTMLDivElement>(null);

  function check() {
    const div = divRef.current;
    if (div === null) return;

    const info = getInfoByScroll(div);
    console.log('@info', info);
  }

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'scroll',
      eventListener(event) {
        check();
      },
    },
  });

  return (
    <>
      <div className="w-full relative mb-[1400px]"></div>

      <div ref={divRef} className="w-[100px] h-[100px] bg-red-500 m-10 flex flex-wrap items-center justify-start"></div>

      <div className="w-full relative mt-[1400px]"></div>
    </>
  );
}
