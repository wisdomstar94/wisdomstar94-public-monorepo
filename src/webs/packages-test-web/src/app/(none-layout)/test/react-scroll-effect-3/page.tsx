'use client';

import { classes } from '#packages-common-lib';
import { useScrollEffectManager } from '@wisdomstar94/react-scroll-effect';

export default function Page() {
  const scrollEffectManager = useScrollEffectManager({
    onScroll(params) {
      const { wrapperElementMap } = params;
      const box1Item = wrapperElementMap.get('box-1');
      // console.log('@box1Item?.childParams', box1Item?.childParams);

      const box2Item = wrapperElementMap.get('box-2');
      // console.log('@box2Item?.childParams', box2Item?.childParams);
    },
  });

  return (
    <>
      <div className="w-full h-[400px] bg-orange-400">hi</div>
      <div className="w-full h-[300px] bg-green-600">hi 2</div>
      {scrollEffectManager.scrollEffectComponent({
        id: 'box-1',
        wrapperClassName: 'w-full relative',
        child(params) {
          console.log('@@ @@ box-1', params?.boundingClientRect);
          return <div className={classes('w-full font-bold bg-red-200', params?.boundingClientRect === undefined ? 'text-3xl' : 'text-8xl')}>box-1</div>;
        },
      })}
      {scrollEffectManager.scrollEffectComponent({
        id: 'box-2',
        wrapperClassName: 'w-full relative',
        child(params) {
          console.log('@@ @@ box-2', params?.boundingClientRect);
          return <div className="w-full text-3xl font-bold bg-purple-200">box-2</div>;
        },
      })}
      <div className="w-full relative bg-blue-300 h-auto flex flex-nowrap">
        <div className="flex flex-wrap gap-2 relative flex-1">
          <div className="w-full h-[300px] bg-slate-200">item 1</div>
          <div className="w-full h-[300px] bg-slate-300">item 2</div>
          <div className="w-full h-[300px] bg-slate-400">item 3</div>
          <div className="w-full h-[300px] bg-slate-500">item 4</div>
          <div className="w-full h-[300px] bg-slate-600 text-white">item 5</div>
          <div className="w-full h-[300px] bg-slate-700 text-white">item 6</div>
        </div>
      </div>
      <div className="w-full h-[400px] bg-pink-400">hi</div>
      <div className="w-full h-[400px] bg-red-400">hi 22</div>
      <div className="w-full h-[400px] bg-purple-400">hi 33</div>
    </>
  );
}
