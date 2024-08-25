import { atom, useAtom } from 'jotai';
export const state = atom(0);

export function useAtomCounter() {
  const [value, setValue] = useAtom(state);

  return {
    value,
    setValue,
  };
}
