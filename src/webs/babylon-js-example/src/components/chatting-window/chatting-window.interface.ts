import { Dispatch } from "react";

export declare namespace IChattingWindow {
  export interface ChatItem {
    writer: string;
    writedAt: number;
    content: string;
  }

  export interface Props {
    isShow: boolean;
    setIsShow: Dispatch<boolean>;
    chatItems: ChatItem[];
    onChatEmit: (content: string) => void;
  }
}