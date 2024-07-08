"use client"

import { useSocketioManager } from "@wisdomstar94/react-socketio-manager";

export default function Page() {
  const socketioManager = useSocketioManager({
    isAutoConnect: true,
    socketUrl: 'localhost:3010',
    listeners: [
      {
        eventName: 'getOtherDatas',
        callback(data) {
          console.log('@getOtherDatas', data);
        },
      }
    ]
  });
    
  return (
    <>
      <button onClick={() => {
        socketioManager.emit('good', { name: 'hi~~zz' + Date.now() });
      }}>good 이벤트 보내기</button>
    </>
  );
}