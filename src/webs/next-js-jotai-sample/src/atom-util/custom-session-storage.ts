import { SyncStorage } from 'jotai/vanilla/utils/atomWithStorage';

export const customSessionStorage: SyncStorage<string> = {
  getItem: (key: string) => {
    if (typeof sessionStorage === 'undefined') return '';
    return sessionStorage.getItem(key) ?? '';
  },
  setItem: (key: string, newValue: string) => {
    if (typeof sessionStorage === 'undefined') return;
    if (newValue === null) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, newValue);
    }
  },
  removeItem: (key: string) => {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.removeItem(key);
  },
};
