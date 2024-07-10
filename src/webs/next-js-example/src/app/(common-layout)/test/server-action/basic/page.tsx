"use client";

import { test } from "@/server-actions/test.action";

export default function Page() {
  return (
    <>
      <div>
        <button
          onClick={() => {
            test({
              name: '홍길동',
              age: 20,
            }).then((res) => {
              console.log('@res', res);
            });
          }}
          >
          test server action call!
        </button>
      </div>
    </>
  );
}