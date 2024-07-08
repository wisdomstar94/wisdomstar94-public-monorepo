
"use client"

import { usePromiseInterval } from "@wisdomstar94/react-promise-interval";
import { useCallback, useRef } from "react";

export default function Page() {
  const count = useRef<number>(0);

  const promiseInterval = usePromiseInterval({
    intervalTime: 2000,
    fn() {
      return new Promise<number>(function(resolve, reject) {
        console.log('@execute promise!', count.current);
        count.current++;
        if (count.current < 5) {
          reject(false);
        } else {
          resolve(count.current);
        }
      });
    },
  });

  return (
    <>
      <button 
        className="px-6 py-2 text-sm text-black border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-200"
        onClick={() => {
          promiseInterval.start({ isCallWhenStarted: true });
        }}>
        try promise interval  
      </button>
      <button 
        className="px-6 py-2 text-sm text-black border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-200"
        onClick={() => {
          promiseInterval.stop();
        }}>
        stop promise interval  
      </button>      
    </>
  );
}
