'use client';

import { ScrollEffect } from '@wisdomstar94/react-scroll-effect';
import { CSSProperties, useState } from 'react';
import { classes } from '#packages-common-lib';

export default function Page() {
  const [titleState, setTitleState] = useState<'top' | 'sticky' | 'bottom'>('top');

  const titleWrapperStyle: CSSProperties = {};
  if (titleState === 'top') {
  } else if (titleState === 'sticky') {
    titleWrapperStyle.position = 'sticky';
    titleWrapperStyle.top = '0';
    titleWrapperStyle.left = '0';
  } else if (titleState === 'bottom') {
    titleWrapperStyle.position = 'absolute';
    titleWrapperStyle.bottom = '0';
  }

  return (
    <>
      <div className="w-full h-[400px] bg-orange-400">hi</div>
      <div className="w-full h-[300px] bg-green-600">hi 2</div>
      <div className="w-full relative bg-blue-300 h-auto flex flex-nowrap">
        <div className={classes('block relative flex-1')}>
          <ScrollEffect
            id="title"
            wrapperClassName="w-full relative"
            wrapperStyle={titleWrapperStyle}
            onChangeScrollParams={(params) => {
              if (params.boundingClientRect !== null) {
                if (params.boundingClientRect.y <= 0) {
                  setTitleState('sticky');
                }
              }
            }}
            child={() => <div className="inline-flex text-5xl font-bold">Title</div>}
          />
          <ScrollEffect
            id="bottom-row"
            wrapperClassName="w-full absolute bottom-0 left-0 z-[-1]"
            onChangeScrollParams={(params) => {
              if (params.boundingClientRect !== null) {
                if (params.boundingClientRect.y <= 0) {
                  setTitleState('bottom');
                }
              }
            }}
            child={() => <div className="inline-flex text-5xl font-bold opacity-0 relative">Title</div>}
          />
        </div>
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
