import { customLocalStorage } from '@/atom-util/custom-local-storage';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useEffect, useState } from 'react';

export type User = {
  name: string;
  age: number;
  hobby?: string;
};

const key = 'user' as const;
const initialValue = '';
const state = atomWithStorage(key, initialValue, customLocalStorage);

export function useAtomUser() {
  const [isMounted, setIsMounted] = useState(false);
  const [value, setValue] = useAtom(state);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    setIsMounted(true);
  }, []);

  return {
    value: value.trim() === '' ? undefined : (JSON.parse(value) as User),
    setValue: (v: User | undefined | null) => {
      if (v === undefined || v === null) {
        setValue((prev) => '');
        return;
      }
      setValue((prev) => JSON.stringify(v));
    },
    isMounted,
  };
}
