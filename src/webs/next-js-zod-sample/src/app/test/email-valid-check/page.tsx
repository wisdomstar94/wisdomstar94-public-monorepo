'use client';

import { isValidEmail } from '@/utils/valid-checker';
import { useState } from 'react';

export default function Page() {
  const [email, setEmail] = useState('');
  const [isEmail, setIsEmail] = useState<boolean>();

  return (
    <>
      <div className="w-full relative text-black font-bold text-lg">/test/email-valid-check</div>
      <div className="w-full relative flex flex-wrap gap-2">
        <input type="text" className="inline-flex border border-red-500 px-3 py-1.5 text-xs text-black" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button
          className="inline-flex px-3 py-1.5 text-xs border border-slate-500 cursor-pointer hover:bg-slate-200"
          onClick={() => {
            const result = isValidEmail(email);
            setIsEmail(result);
          }}>
          email 입니까?
        </button>
        <div className="w-full text-lg font-bold">
          {isEmail === true ? <span className="text-blue-500">예, 이메일 형식이 맞습니다.</span> : null}
          {isEmail === false ? <span className="text-red-500">아니오, 이메일 형식이 아닙니다.</span> : null}
        </div>
      </div>
    </>
  );
}
