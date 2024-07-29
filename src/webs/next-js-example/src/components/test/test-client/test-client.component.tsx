"use client"

import { ReactNode, useEffect } from "react";

export function TestClient(props: { children: ReactNode, where: string }) {
  console.log(`@[${props.where}] test client component render!`);

  useEffect(() => {
    console.log(`@[${props.where}] test client component mounted!!`);
  }, []);

  return (
    <>
      { props.children }
    </>
  );
}