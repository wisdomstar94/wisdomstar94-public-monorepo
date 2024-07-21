import { Dispatch } from "react";

export declare namespace IChattingWindow {
  export interface ChatItem {
    writer: string;
    writerId: string;
    writedAt: number;
    content: string;
  }

  export interface Props {
    isShow: boolean;
    clientId: string;
    setIsShow: Dispatch<boolean>;
    chatItems: ChatItem[];
    onChatEmit: (content: string) => void;
    onFocusChangeInput?: (isFocus: boolean) => void;
  }
}