"use client"

import { useRequestAnimationFrameManager } from "@wisdomstar94/react-request-animation-frame-manager";
import { useEffect, useState } from "react";

export default function Page() {
  const [count, setCount] = useState<number>(0);

  const requestAnimationFrameManager = useRequestAnimationFrameManager({
    isAutoStart: true,
    callback(startedTimestamp, currentTimestamp, step) {
      console.log('@step', step);
      console.log('@count', count);
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
    
  return (
    <>
      console 창을 확인해보세요.
      <div>
        <button onClick={() => {
          requestAnimationFrameManager.stop();
        }}>멈추기</button>
      </div>
      <div>
        <button onClick={() => {
          requestAnimationFrameManager.start();
        }}>다시 실행</button>
      </div>
    </>
  );
}