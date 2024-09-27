import { createfetchInstance } from '@/fetcher/fetcher';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const instance = createfetchInstance('https://cat-fact.herokuapp.com/facts/?a=bbb');
  const res = await instance.call();
  console.log('@res', res);
  return <>{children}</>;
}
