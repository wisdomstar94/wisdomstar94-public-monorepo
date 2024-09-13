'use client';

import { useEffect, useRef } from 'react';
import { applyOverlayScroll } from '@wisdomstar94/vanilla-js-util';
import styles from './page.module.scss';

export default function Page() {
  const div = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (div.current === null) return;

    const applyResult = applyOverlayScroll({
      target: div.current,
      width: 14,
      padding: 4,
      scrollEndedHideDelay: 100,
      scrollBarClassName: 'bg-slate-800/70 rounded-full',
    });

    return () => {
      applyResult.cleanup();
    };
  }, []);

  return (
    <>
      <div className="w-[600px] h-[600px] relative m-7">
        <div ref={div} className={`w-full h-full bg-red-300 relative flex flex-wrap gap-2 overflow-y-scroll ${styles['scroll-container']}`}>
          {Array.from({ length: 100 }).map((item, index) => {
            return (
              <div key={index} className="w-full flex flex-wrap gap-2 relative">
                {index}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
