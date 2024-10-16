'use client';

import { useSseManager } from '@wisdomstar94/react-sse-manager';
import { useEffect } from 'react';

export default function Page() {
  const sseManager = useSseManager({
    mountedOptions: {
      autoConnect: {
        enable: true,
        connectOption: {
          url: 'http://localhost:3020/test/sse',
          eventSourceInitDict: {
            withCredentials: true,
          },
        },
      },
    },
  });

  sseManager.setDefaultEventListener({
    eventName: 'open',
    listener(event) {
      console.log('@open.event', event);
    },
  });

  sseManager.setDefaultEventListener({
    eventName: 'error',
    listener(event) {
      console.log('@error.event', event);
    },
  });

  sseManager.setDefaultEventListener({
    eventName: 'message',
    listener(event) {
      console.log('@message.event', event);
    },
  });

  useEffect(() => {
    console.log('sseManager.connectState', sseManager.connectState);
  }, [sseManager.connectState]);

  return (
    <>
      <div className="w-full flex flex-wrap gap-4 relative">
        <div className="inline-flex flex-wrap gap-2 relative">
          <span>connectState :</span>
          <span>{sseManager.connectState.state}</span>
        </div>
      </div>
    </>
  );
}
