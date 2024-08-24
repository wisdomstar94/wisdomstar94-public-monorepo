'use client';

import { FC } from 'react';

const Page: FC = () => {
  return (
    <>
      <ul>
        {Array.from({ length: 10 }).map((item, index) => {
          return (
            <li key={index} className="nth-[4n]:bg-red-500 nth-[4n]:text-white">
              item {index}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Page;
