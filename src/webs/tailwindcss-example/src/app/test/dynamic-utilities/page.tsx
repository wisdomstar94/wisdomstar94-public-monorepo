import { FC } from 'react';

const Page: FC = () => {
  return (
    <>
      <div className="bg-red-500 text-white flex justify-center items-center w-[100px] h-[100px]">1</div>
      <div className="bg-blue-500 text-white flex justify-center items-center w-[100px] h-[100px] rotate-60">2</div>
      <div className="bg-green-500 text-white flex justify-center items-center w-[100px] h-[100px]">3</div>

      <div className="w-[100px] h-[100px] blur-custom-5">hi</div>

      <div className="w-[100px] h-[100px] bg-outline-red-500">hi</div>
      <div className="w-[100px] h-[100px] bg-outline-green-500">hi</div>
    </>
  );
};

export default Page;
