'use client'

import { ScrollEffect } from "@wisdomstar94/react-scroll-effect";

export default function Page() {
  return (
    <>
      <ScrollEffect
        id="01"
        wrapperClassName="w-full relative bg-red-500"
        child={(params) => {
          // console.log('@1 params.factor', params.factor);
          // console.log('@1 params.factorMode', params.factorMode);
          // console.log('@1 params.isContainShowArea', params.isContainShowArea);
          return (
            <div className="w-full h-[400px]">hi</div>
          );
        }}
      />
      <ScrollEffect
        id="02"
        wrapperClassName="w-full relative bg-blue-500"
        showAreaReactionSensitive={0}
        child={(params) => {
          console.log('@2 params', params);
          // console.log('@2 params.factor', params.factor);
          // console.log('@1 params.factorMode', params.factorMode);
          // console.log('@2 params.isContainShowArea', params.isContainShowArea);
          return (
            <div className="w-full h-[800px]">hi</div>
          );
        }}
      />
      <ScrollEffect
        id="03"
        wrapperClassName="w-full relative bg-green-500"
        child={(params) => {
          // console.log('@3 params.factor', params.factor);
          // console.log('@1 params.factorMode', params.factorMode);
          // console.log('@3 params.isContainShowArea', params.isContainShowArea);
          return (
            <div className="w-full h-[800px]">hi</div>
          );
        }}
      />
    </>
  );
}