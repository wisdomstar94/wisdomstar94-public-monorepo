import { useSyncExternalStore } from "react";

export function useNetwork() {
  // useSyncExternalStore 는 리액트 내부에서 관리되지 않는 외부 값을 구독할 때 사용합니다. (예, 브라우저 API 등)
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  function getSnapshot() {
    return navigator.onLine;
  }

  function subscribe(callback: () => void) {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);

    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  }

  return {
    isOnline,
  };
}