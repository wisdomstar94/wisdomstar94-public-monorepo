'use client';

import { useScrollEffectManager } from '@wisdomstar94/react-scroll-effect';

export default function Page() {
  const scrollEffectManager = useScrollEffectManager();

  return (
    <>
      {scrollEffectManager.scrollEffectComponent({
        id: '01',
        wrapperClassName: 'w-full relative bg-red-500',
        child: (params) => {
          if (params === undefined) return;
          console.log('@1 params.factor', params.factor);
          console.log('@1 params.factorMode', params.factorMode);
          console.log('@1 params.isContainShowArea', params.isContainShowArea);
          return <div className="w-full h-[400px]">hi</div>;
        },
      })}

      {scrollEffectManager.scrollEffectComponent({
        id: '02',
        wrapperClassName: 'w-full relative bg-green-500',
        child: (params) => {
          if (params === undefined) return;
          console.log('@2 params.factor', params.factor);
          console.log('@2 params.factorMode', params.factorMode);
          console.log('@2 params.isContainShowArea', params.isContainShowArea);
          return <div className="w-full h-[800px]">hi 2</div>;
        },
      })}

      {scrollEffectManager.scrollEffectComponent({
        id: '03',
        wrapperClassName: 'w-full relative bg-blue-500',
        child: (params) => {
          if (params === undefined) return;
          console.log('@3 params.factor', params.factor);
          console.log('@3 params.factorMode', params.factorMode);
          console.log('@3 params.isContainShowArea', params.isContainShowArea);
          return <div className="w-full h-[800px]">hi 3</div>;
        },
      })}
    </>
  );
}
