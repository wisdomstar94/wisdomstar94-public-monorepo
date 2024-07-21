import { useEffect, useRef, useState } from "react";
import { IChattingWindow } from "./chatting-window.interface";
import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";

export function ChattingWindow(props: IChattingWindow.Props) {
  const {
    isShow,
    setIsShow,
    chatItems,
    clientId,
    onChatEmit,
    onFocusChangeInput,
  } = props;

  const [chat, setChat] = useState('');
  const ulRef = useRef<HTMLUListElement>(null);
  const ulContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: 'keyup',
      eventListener(event) {
        const key = event.key;
        // console.log('---key', key);
        if (key.toLowerCase() === 'enter') {
          if (isShow) {
            inputRef.current?.focus();
          }
        } else if (key.toLowerCase() === 'escape') {
          setIsShow(false);
        }
      },
    },
  });

  useEffect(() => {
    const ul = ulRef.current;
    if (ul === null) return;

    const ulContainer = ulContainerRef.current;
    if (ulContainer === null) return;

    const ulRect = ul.getBoundingClientRect();
    const ulContainerRect = ulContainer.getBoundingClientRect();

    let totalLiHeight = 0;

    for (let i = 0; i < ul.children.length; i++) {
      const li = ul.children[i] as HTMLElement;
      const rect = li.getBoundingClientRect();
      totalLiHeight += rect.height;
    }

    ulContainer.scrollTop = totalLiHeight - ulContainerRect.height + 100;
  }, [chatItems]);

  useEffect(() => {
    if (isShow) {
      inputRef.current?.focus();
    }
  }, [isShow]);

  if (!isShow) {
    return (
      <>
        <div
          className="cursor-pointer bg-black/70 hover:bg-black/90 w-[100px] fixed bottom-0 text-xs text-white flex flex-wrap justify-center items-center py-1.5" style={{ left: `calc((100% - 100px) / 2)` }}
          onClick={() => {
            setIsShow(true);
          }}
          >
          chat open
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ width: 'calc(100% - 24px)' }} className="h-[200px] bg-black/80 fixed bottom-3 left-3 z-20 flex flex-col items-end">
        <div className="w-full h-full overflow-y-scroll relative" ref={ulContainerRef}>
          <ul className="w-full h-auto relative gap-1 p-2" ref={ulRef}>
            {
              chatItems.map((item, index) => {
                return (
                  <li key={item.writer + item.writedAt + index} className={`w-full relative flex flex-nowrap group/item ${item.writerId === clientId ? 'me' : ''}`}>
                    <div className="w-[70px] text-xs text-white flex-shrink-0 group-[.me]/item:text-blue-400">
                      { item.writer } :
                    </div>
                    <div className="w-full text-xs text-white whitespace-pre-line break-all group-[.me]/item:text-blue-400">
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
            className="border-0 outline-none p-2 text-white text-sm bg-transparent w-full h-full focus:outline-blue-200 outline-offset-3" 
            placeholder="입력하세요."
            value={chat}
            onChange={e => setChat(e.target.value)}
            onKeyUp={(event) => {
              if (chat.trim() === '') return;

              const key = event.key;
              if (key.toLowerCase() === 'enter') {
                onChatEmit(chat);
                setChat('');
              }
            }}
            onFocus={() => {
              if (typeof onFocusChangeInput === 'function') onFocusChangeInput(true);
            }}
            onBlur={() => {
              if (typeof onFocusChangeInput === 'function') onFocusChangeInput(false);
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