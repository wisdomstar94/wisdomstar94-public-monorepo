
"use client"

import { TouchContainer } from "@wisdomstar94/react-touch-container";

export default function Page() {
  return (
    <>
      <div className="fixed bottom-0 left-0 z-20">
        <TouchContainer
          className="w-[100px] h-[100px] bg-red-500"
          onTouchStart={() => {
            console.log('@red touch start!!');
          }}
          onTouchEnd={() => {
            console.log('@red touch end!!');
          }}
          />
      </div>
      <div className="fixed bottom-0 right-0 z-20">
        <TouchContainer
          className="w-[100px] h-[100px] bg-blue-500"
          onTouchStart={() => {
            console.log('@blue touch start!!');
          }}
          onTouchEnd={() => {
            console.log('@blue touch end!!');
          }}
          />
      </div>
    </>
  );
}
