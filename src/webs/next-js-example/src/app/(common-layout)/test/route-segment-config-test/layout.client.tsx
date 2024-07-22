"use client";

import { revalidateTag } from "next/cache";

export function LayoutClient() {
  return (
    <>
      <button
        className="inline-flex border border-slate-500 px-2 py-1 rounded-sm cursor-pointer bg-slate-50 hover:bg-slate-200"
        onClick={() => {
          revalidateTag('stack-count');
        }}>
        { `revalidateTag('stack-count')` }
      </button>
    </>
  );
}