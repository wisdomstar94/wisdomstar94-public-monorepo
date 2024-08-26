"use client";

import { TestItem } from "@/components/test-item/test-item.component";

export default function Page() {
  return (
    <>
      {Array.from({ length: 10 }).map((item, index) => {
        return <TestItem key={index}>아이템 : {index}</TestItem>
      })}
    </>
  );
}