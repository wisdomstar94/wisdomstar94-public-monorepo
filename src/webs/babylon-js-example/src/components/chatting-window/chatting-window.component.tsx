import { useEffect, useRef, useState } from "react";
import { IChattingWindow } from "./chatting-window.interface";

export function ChattingWindow(props: IChattingWindow.Props) {
  const {
    isShow,
    setIsShow,
    chatItems,
    onChatEmit,
  } = props;

  const [chat, setChat] = useState('');
  const ulRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const ul = ulRef.current;
    if (ul === null) return;

    const ulRect = ul.getBoundingClientRect();

    let totalLiHeight = 0;

    for (let i = 0; i < ul.children.length; i++) {
      const li = ul.children[i] as HTMLElement;
      const rect = li.getBoundingClientRect();
      totalLiHeight += rect.height;
    }

    ul.scrollTop = totalLiHeight - ulRect.height;
  }, [chatItems]);

  useEffect(() => {
    if (isShow) {
      inputRef.current?.focus();
    }
  }, [isShow]);

  if (!isShow) return null;

  return (
    <>
      <div style={{ width: 'calc(100% - 24px)' }} className="h-[200px] bg-black/80 fixed bottom-3 left-3 z-20 flex flex-col items-stretch justify-stretch">
        <div className="w-full relative h-full">
          <ul className="w-full h-full relative overflow-y-scroll gap-1 p-2" ref={ulRef}>
            {
              chatItems.map((item, index) => {
                return (
                  <li key={item.writer + item.writedAt + index} className="w-full relative flex flex-nowrap">
                    <div className="w-[70px] text-xs text-white flex-shrink-0">
                      { item.writer } :
                    </div>
                    <div className="w-full text-xs text-white whitespace-pre-line break-all">
                      { item.content }
                    </div>
                  </li>
                );
              })
            }
          </ul>
        </div>
        <div className="w-full relative h-[40px] flex-shrink-0">
          <input 
            ref={inputRef}
            type="text" 
            maxLength={100} 
            className="border-0 outline-none p-2 text-white text-sm bg-transparent w-full h-full" 
            placeholder="입력하세요."
            value={chat}
            onChange={e => setChat(e.target.value)}
            onKeyDown={(event) => {
              if (chat.trim() === '') return;

              const key = event.key;
              if (key.toLowerCase() === 'enter') {
                onChatEmit(chat);
                setChat('');
              }
            }}
            />
        </div>
        <div className="inline-flex px-3 py-1 cursor-pointer absolute -top-6 -right-0 bg-black/80 text-xs text-white" onClick={() => {
          setIsShow(false);
        }}>
          닫기
        </div>
      </div>
    </>
  );
}