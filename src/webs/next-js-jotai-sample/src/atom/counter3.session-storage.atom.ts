import { customSessionStorage } from '@/atom-util/custom-session-storage';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useEffect, useState } from 'react';

const key = 'counter3' as const;
const initialValue = '';
const state = atomWithStorage(key, initialValue, customSessionStorage);

export function useAtomCounter3() {
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
