'use client';

import { useFetcher } from '@/fetcher/use-fetcher';

export default function Page() {
  const fetcher = useFetcher();

  return (
    <>
      <button
        onClick={() => {
          const instance = fetcher.createFetchInstance('https://cat-fact.herokuapp.com/facts/?a=bbb');
          instance.call().then((res) => {
            console.log('@res', res);
          });
        }}
      >
        fetch!
      </button>
    </>
  );
}
