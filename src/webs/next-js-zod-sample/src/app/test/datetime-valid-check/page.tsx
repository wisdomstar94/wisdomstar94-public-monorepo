'use client';

import { isValidDateTime } from '@/utils/valid-checker';
import { useState } from 'react';

export default function Page() {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState<boolean>();
  const [tags, setTags] = useState([
    '2024-02-29',
    '2024-02-30',
    '2024-02-31',
    '2024-00-29',
    '2024-1229',
    '20241229',
    '202412-29',
    '141024',
    '14:10:24',
    '14:1000',
    '14:10:00',
    '14:10:60',
    '2024-02-29 14:10:01',
    '2024-02-29T14:10:01.123Z',
    '2024-02-29T14:10:01Z',
    '2024-02-2914:10:01',
    '2024-02-29 4:10:01',
    '2024-02-29 14:10',
  ]);

  return (
    <>
      <div className="w-full relative text-black font-bold text-lg">/test/datetime-valid-check</div>
      <div className="w-full relative flex flex-wrap gap-2">
        <input type="text" className="w-[200px] inline-flex border border-red-500 px-3 py-1.5 text-xs text-black" value={value} onChange={(e) => setValue(e.target.value)} />
        <button
          className="inline-flex px-3 py-1.5 text-xs border border-slate-500 cursor-pointer hover:bg-slate-200"
          onClick={() => {
            const result = isValidDateTime(value);
            setIsValid(result);
          }}>
          datetime 입니까?
        </button>
        <div className="w-full relative flex flex-wrap gap-2">
          {tags.map((tag) => {
            return (
              <div
                key={tag}
                className="inline-flex bg-purple-300 rounded-md px-2.5 py-1.5 text-xs text-slate-800 cursor-pointer hover:bg-purple-400"
                onClick={() => {
                  setValue(tag);
                }}>
                {tag}
              </div>
            );
          })}
        </div>
        <div className="w-full text-lg font-bold">
          {isValid === true ? <span className="text-blue-500">예, 날짜/시간 형식이 맞습니다.</span> : null}
          {isValid === false ? <span className="text-red-500">아니오, 날짜/시간 형식이 아닙니다.</span> : null}
        </div>
      </div>
    </>
  );
}
