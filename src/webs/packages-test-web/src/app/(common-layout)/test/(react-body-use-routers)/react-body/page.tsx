"use client"

import { useBody } from '@wisdomstar94/react-body';

export default function Page() {
  const body = useBody();

  return (
    <>
      <div className="w-full relative block">
        <div className="w-[500px] h-[300px] bg-red-400">hi</div>
        <div className="w-[500px] h-[300px] bg-yellow-400">hello</div>
        <div className="w-[500px] h-[300px] bg-blue-400">nice</div>
        <div className="w-[500px] h-[300px] bg-green-400">you</div>
      </div>
      
      <div className="w-full fixed bottom-0 left-0">
        <div className="w-full relative flex flex-wrap gap-2">
          <div className="inline-flex">
            스크롤 상태 : { body.scrollState }
          </div>
          <div className="inline-flex">
            텍스트 드래그 상태 : { body.textDragState }
          </div>
        </div>
        <button
          onClick={() => {
            body.denyScroll();
          }}>
          스크롤 막기
        </button>
        <button
          onClick={() => {
            body.allowScroll();
          }}>
          스크롤 막기 해제
        </button>
        <button
          onClick={() => {
            body.denyTextDrag();
          }}>
          텍스트 드래그 막기
        </button>
        <button
          onClick={() => {
            body.allowTextDrag();
          }}>
          텍스트 드래그 막기 해제
        </button>
      </div>
    </>
  );
}