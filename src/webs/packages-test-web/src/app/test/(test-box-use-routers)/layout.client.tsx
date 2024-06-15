"use client"

import { useEffect } from "react"

export function LayoutClient() {
  useEffect(() => {
    return () => {
      console.log(`(test-box-use-routers) layout destroy!`);
    };
  }, []);

  return <></>;
}