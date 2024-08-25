import { customLocalStorage } from '@/atom-util/custom-local-storage';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useEffect, useState } from 'react';

const key = 'counter2' as const;
const initialValue = '';
const state = atomWithStorage(key, initialValue, customLocalStorage);

export function useAtomCounter2() {
  const [isMounted, setIsMounted] = useState(false);
  const [value, setValue] = useAtom(state);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    setIsMounted(true);
  }, []);

  return {
    value,
    setValue,
    isMounted,
  };
}
