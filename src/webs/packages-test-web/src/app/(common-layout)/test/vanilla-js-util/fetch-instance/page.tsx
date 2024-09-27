'use client';

import { useFetcher } from '@/fetcher/use-fetcher';

export default function Page() {
  const fetcher = useFetcher();

  return (
    <>
      <button
        onClick={() => {
          const instance = fetcher.createInstance('https://cat-fact.herokuapp.com/facts/?a=bbb');
          instance.call();
        }}
      >
        fetch!
      </button>
    </>
  );
}
