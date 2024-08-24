import { FC } from 'react';

const Page: FC = () => {
  return (
    <>
      <div className="fixed top-[40px] left-[40px] bg-red-500 text-white flex justify-center items-center w-[100px] h-[100px]">1</div>
      <div className="fixed top-[90px] left-[90px] bg-blue-500 text-white flex justify-center items-center w-[100px] h-[100px] rotate-60">2</div>
      <div className="fixed top-[140px] left-[140px] bg-green-500 text-white flex justify-center items-center w-[100px] h-[100px]">3</div>
    </>
  );
};

export default Page;
