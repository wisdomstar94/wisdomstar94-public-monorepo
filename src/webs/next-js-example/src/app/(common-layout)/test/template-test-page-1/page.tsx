"use client"

import { useEffect } from "react";

export default function Page() {
  console.log('@test/template-test-page-1 render!');

  useEffect(() => {
    console.log('@test/template-test-page-1 mounted!');
  }, []);

  return (
    <>
      @ /test/template-test-page-1
    </>
  );
}