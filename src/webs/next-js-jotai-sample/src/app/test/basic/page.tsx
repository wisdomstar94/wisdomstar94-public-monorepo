'use client';

import { useAtomCounter } from '@/atom/counter.atom';
import { useAtomCounter2 } from '@/atom/counter2.local-storage.atom';
import { useAtomCounter3 } from '@/atom/counter3.session-storage.atom';
import { useAtomUser } from '@/atom/user.local-storage.atom';
import { FC, useState } from 'react';

const Page: FC = () => {
  const counter = useAtomCounter();
  const counter2 = useAtomCounter2();
  const counter3 = useAtomCounter3();
  const user = useAtomUser();

  const [inputedUserName, setInputedUserName] = useState('');
  const [inputedUserAge, setInputedUserAge] = useState('0');

  return (
    <>
      <ul className="w-full flex flex-wrap gap-4 relative">
        <li className="w-full flex flex-wrap gap-4 border border-slate-500 p-3 items-center">
          <div>counter (일반 전역 상태):</div>
          <div>{counter.value}</div>
          <div className="inline-flex flex-wrap gap-2">
            <button
              className="inline-flex px-3 py-1 text-sm text-slate-600 bg-slate-300 hover:bg-slate-400/70 rounded-md cursor-pointer"
              onClick={() => {
                counter.setValue((prev) => prev + 1);
              }}
            >
              counter +1 증가시키기
            </button>
            <button
              className="inline-flex px-3 py-1 text-sm text-slate-600 bg-slate-300 hover:bg-slate-400/70 rounded-md cursor-pointer"
              onClick={() => {
                counter.setValue((prev) => prev - 1);
              }}
            >
              counter -1 감소시키기
            </button>
          </div>
        </li>
        <li className="w-full flex flex-wrap gap-4 border border-slate-500 p-3 items-center">
          <div>counter2 (로컬스토리지 동기화 전역 상태):</div>
          <div>{counter2.isMounted ? counter2.value : 'loading...'}</div>
          <div className="inline-flex flex-wrap gap-2">
            <button
              className="inline-flex px-3 py-1 text-sm text-slate-600 bg-slate-300 hover:bg-slate-400/70 rounded-md cursor-pointer"
              onClick={() => {
                counter2.setValue((prev) => (Number(prev) + 1).toString());
              }}
            >
              counter2 +1 증가시키기
            </button>
            <button
              className="inline-flex px-3 py-1 text-sm text-slate-600 bg-slate-300 hover:bg-slate-400/70 rounded-md cursor-pointer"
              onClick={() => {
                counter2.setValue((prev) => (Number(prev) - 1).toString());
              }}
            >
              counter2 -1 감소시키기
            </button>
          </div>
        </li>
        <li className="w-full flex flex-wrap gap-4 border border-slate-500 p-3 items-center">
          <div>counter3 (세션스토리지 동기화 전역 상태):</div>
          <div>{counter3.isMounted ? counter3.value : 'loading...'}</div>
          <div className="inline-flex flex-wrap gap-2">
            <button
              className="inline-flex px-3 py-1 text-sm text-slate-600 bg-slate-300 hover:bg-slate-400/70 rounded-md cursor-pointer"
              onClick={() => {
                counter3.setValue((prev) => (Number(prev) + 1).toString());
              }}
            >
              counter3 +1 증가시키기
            </button>
            <button
              className="inline-flex px-3 py-1 text-sm text-slate-600 bg-slate-300 hover:bg-slate-400/70 rounded-md cursor-pointer"
              onClick={() => {
                counter3.setValue((prev) => (Number(prev) - 1).toString());
              }}
            >
              counter3 -1 감소시키기
            </button>
          </div>
        </li>
        <li className="w-full flex flex-wrap gap-4 border border-slate-500 p-3 items-center">
          <div>user 객체 (로컬스토리지 동기화 전역 상태):</div>
          <div>{user.isMounted ? (user.value === undefined ? 'undefined' : JSON.stringify(user.value)) : 'loading...'}</div>
          <div className="w-full flex flex-wrap gap-2 flex-col">
            <div className="inline-flex flex-wrap gap-2 items-center">
              <span>user.value.name 을 </span>
              <input className="inline-flex px-2 py-0.5 text-sm text-slate-700 border border-slate-400" type="text" value={inputedUserName} onChange={(e) => setInputedUserName(e.target.value)} />
              <button
                className="inline-flex px-3 py-1 text-sm text-slate-600 bg-slate-300 hover:bg-slate-400/70 rounded-md cursor-pointer"
                onClick={() => {
                  if (user.value === undefined) {
                    user.setValue({ name: inputedUserName, age: 0 });
                  } else {
                    user.setValue({ ...user.value, name: inputedUserName });
                  }
                }}
              >
                으로 변경하기
              </button>
            </div>
            <div className="inline-flex flex-wrap gap-2 items-center">
              <span>user.value.age 을 </span>
              <input className="inline-flex px-2 py-0.5 text-sm text-slate-700 border border-slate-400" type="number" value={inputedUserAge} onChange={(e) => setInputedUserAge(e.target.value)} />
              <button
                className="inline-flex px-3 py-1 text-sm text-slate-600 bg-slate-300 hover:bg-slate-400/70 rounded-md cursor-pointer"
                onClick={() => {
                  if (user.value === undefined) {
                    user.setValue({ name: '', age: Number(inputedUserAge) });
                  } else {
                    user.setValue({ ...user.value, age: Number(inputedUserAge) });
                  }
                }}
              >
                으로 변경하기
              </button>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default Page;
