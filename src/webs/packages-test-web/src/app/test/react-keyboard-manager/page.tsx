"use client"

import { useKeyboardManager } from "@wisdomstar94/react-keyboard-manager";

export default function Page() {
  useKeyboardManager({
    onChangeKeyMapStatus(keyMap) {
      console.log('@keyMap', keyMap);
    },
  });
    
  return (
    <>
      keyboard 의 key 를 눌러보면서 console 창을 확인해보세요.
    </>
  );
}