'use client';

import { classes } from '@/util/classes';
import { FC, useState } from 'react';

const Page: FC = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div className={classes([isActive && 'my-active', 'w-full flex flex-wrap gap-4'])}>
        <div>
          <div className="w-10 h-10 my-active:bg-green-500">gg</div>
          <div className="w-10 h-1 my-active:bg-black"></div>
        </div>
      </div>
      <div className="w-full relative gap-4">
        <input className="hocus:bg-green-400" placeholder="focus or hover 해보세요." />
        <button
          className={classes('inline-flex px-2 py-0.5 cursor-pointer hover:bg-slate-200 border border-slate-200')}
          onClick={() => {
            setIsActive((prev) => !prev);
          }}>
          active toggle
        </button>
      </div>
    </>
  );
};

export default Page;
