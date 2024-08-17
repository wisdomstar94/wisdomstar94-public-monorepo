'use client'

import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";
import { useRef } from "react";

export default function Page() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const divRef1 = useRef<HTMLDivElement>(null);
  const divRef2 = useRef<HTMLDivElement>(null);
  const divRef3 = useRef<HTMLDivElement>(null);

  useAddEventListener({
    domEventRequiredInfo: {
      target: scrollContainerRef,
      eventName: 'scroll',
      eventListener(event) {
        const div1 = divRef1.current;
        const div2 = divRef2.current;
        const div3 = divRef3.current;

        if (div1 === null || div2 === null || div3 === null) return;

        // console.log('@div1', { div1 });
        // console.log('@div2', { div2 });
        // console.log('@div3', { div3 });

        const div1Rect = div1.getBoundingClientRect();
        const div2Rect = div2.getBoundingClientRect();
        const div3Rect = div3.getBoundingClientRect();

        console.log('@div1Rect', div1Rect);
        console.log('@div2Rect', div2Rect);
        console.log('@div3Rect', div3Rect);
      },
    },
  });

  return (
    <>
      <div className="w-[400px] h-[400px] mt-10 ml-20 overflow-y-scroll relative" ref={scrollContainerRef}>
        <div ref={divRef1} className="w-full h-[400px] bg-red-500">

        </div>
        <div ref={divRef2} className="w-full h-[800px] bg-blue-500">

        </div>
        <div ref={divRef3} className="w-full h-[600px] bg-green-500">

        </div>
      </div>
      
    </>
  );
}