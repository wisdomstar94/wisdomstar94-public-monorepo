"use client"

import { applySocketLogin } from "@/server-actions/socket-apply.action";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function Page() {
  const isLoggingRef = useRef(false);
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  function onSubmitButtonClick() {
    if (typeof nickname !== 'string') {
      alert('캐릭터 닉네임을 입력해주세요.');
      return;
    }

    if (nickname.trim() === '') {
      alert('공백은 안됩니다.');
      return;
    }

    if (nickname.length > 5) {
      alert('최대 5자까지만 가능합니다.');
      return;
    }

    if (isLoggingRef.current) return;

    isLoggingRef.current = true;
    applySocketLogin(nickname).then((res) => {
      localStorage.setItem('access_token', res.access_token);
      router.push('/test/socket-apply-v3');
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      isLoggingRef.current = false;
    });
  }

  return (
    <>
      <div className="w-full h-full fixed top-0 left-0 bg-slate-200 flex flex-wrap justify-center items-center">
        <div className="w-full max-w-[300px] bg-white p-4 relative flex flex-wrap gap-2 m-4">
          <div className="w-full flex flex-nowrap items-center text-xs relative">
            <label className="w-[80px] flex-shrink-0">캐릭터 닉네임 :</label>
            <input className="w-full border border-slate-400 px-2 py-1 box-border" placeholder="닉네임을 입력해주세요.(최대 5자)" maxLength={5} value={nickname} onChange={e => setNickname(e.target.value)} />
          </div>
          <div className="w-full flex flex-nowrap items-center text-xs relative">
            <button className="w-full px-4 py-2 bg-blue-500 text-white cursor-pointer hover:bg-blue-600" onClick={onSubmitButtonClick}>접속하기</button>
          </div>
        </div>
      </div>
    </>
  );
}