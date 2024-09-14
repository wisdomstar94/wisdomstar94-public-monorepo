'use client';

import { useAddEventListener } from '@wisdomstar94/react-add-event-listener';
import { setPositionTargetElement } from '@wisdomstar94/vanilla-js-util';
import { useRef } from 'react';

export default function Page() {
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  function check() {
    const from = fromRef.current;
    const to = toRef.current;

    if (from === null) return;
    if (to === null) return;

    setPositionTargetElement({
      to,
      from,
      positionOption: {
        type: 'right',
        align: 'end',
      },
    });
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
      <div ref={toRef} className="w-[100px] h-[100px] bg-red-500 m-10 flex flex-wrap items-center justify-start">
        <div className="w-[4px] h-[4px] bg-blue-500"></div>
      </div>
      <div className="w-full mt-[1600px]">..</div>

      <div ref={fromRef} className="w-[8px] h-[8px] bg-blue-500 fixed -top-[400px] -left-[400px]"></div>
    </>
  );
}
