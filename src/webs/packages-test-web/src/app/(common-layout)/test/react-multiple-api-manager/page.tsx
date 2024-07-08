"use client"

import { useMultipleApiManager } from "@wisdomstar94/react-multiple-api-manager";
import { useEffect } from "react";

export default function Page() {
  const multipleApiManager = useMultipleApiManager();

  function tryFetch() {
    multipleApiManager.fetch([
      { 
        key: '1', 
        fn: () => {
          const controller = new AbortController();
          return {
            fetch: () => fetch('https://cdn.pixabay.com/photo/2023/05/29/16/55/pie-8026562_640.jpg', { method: 'get', signal: controller.signal }).then(res => res.blob()),
            cancel: () => {
              controller.abort();
              return Promise.resolve();
            },
          };
        },
        initDelay: 3000, retryCount: 2,
      },
      { 
        key: '2', 
        fn: () => {
          const controller = new AbortController();
          return {
            fetch: () => fetch('https://cdn.pixabay.com/photo/2023/06/01/06/22/british-shorthair-8032816_640.jpg', { method: 'get' }).then(res => res.blob()),
            cancel: () => {
              controller.abort();
              return Promise.resolve();
            },
          };
        }, 
        retryCount: 2, 
      },
      { 
        key: '3', 
        fn: () => {
          const controller = new AbortController();
          return {
            fetch: () => fetch('https://cdn.pixabay.com/photo/2023/05/14/09/39/circle-7992340__340.jpg', { method: 'get' }).then(res => res.blob()), 
            cancel: () => {
              controller.abort();
              return Promise.resolve();
            },
          };
        }, 
        retryCount: 2, 
      },
      { 
        key: '4', 
        fn: () => {
          const controller = new AbortController();
          return {
            fetch: () => fetch('https://cdn.pixabay.com/photo/2023/05/31/11/15/fish-8031138__340.jpg', { method: 'get' }).then(res => res.blob()), 
            cancel: () => {
              controller.abort();
              return Promise.resolve();
            },
          };
        }, 
        initDelay: 6000, 
        retryCount: 2,
      },
      { 
        key: '5', 
        fn: () => {
          const controller = new AbortController();
          return {
            fetch: () => fetch('https://cdn.pixabay.com/photo/2023/05/20/15/03/moon-8006703__340.jpg', { method: 'get' }).then(res => res.blob()), 
            cancel: () => {
              controller.abort();
              return Promise.resolve();
            },
          };
        }, 
        retryCount: 2, 
      },
    ], {
      onComplete(apiItems) {
        console.log('@@onComplete.apiItems', apiItems);
      },
    });
  }

  function tryCancel() {
    console.log('@tryCancel!!');
    multipleApiManager.cancel();
  }

  useEffect(() => {
    console.log('multipleApiManager.dataSet', multipleApiManager.dataSet);
  }, [multipleApiManager.dataSet]);

  useEffect(() => {
    console.log('multipleApiManager.canceledInfo', multipleApiManager.canceledInfo);
  }, [multipleApiManager.canceledInfo]);

  return (
    <>
      <button className="px-4 py-1 text-sm cursor-pointer hover:bg-slate-100" onClick={tryFetch}>
        multiple go!
      </button>
      <button className="px-4 py-1 text-sm cursor-pointer hover:bg-slate-100" onClick={tryCancel}>
        multiple cancel!
      </button>
      <div>
        console 창과 network 창을 확인해보세요!
      </div>
    </>
  );
}
