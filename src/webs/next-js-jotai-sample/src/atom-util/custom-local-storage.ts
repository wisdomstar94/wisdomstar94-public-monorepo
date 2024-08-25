import { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';

export const customLocalStorage: SyncStorage<string> = {
  getItem: (key: string) => {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem(key) ?? '';
  },
  setItem: (key: string, newValue: string | null) => {
    if (typeof localStorage === 'undefined') return;
    if (newValue === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, newValue);
    }
  },
  removeItem: (key: string) => {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  },
};
