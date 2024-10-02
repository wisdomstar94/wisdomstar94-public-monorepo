'use client';

import { fetchInstance } from '@wisdomstar94/vanilla-js-util';
import Cookies from 'js-cookie';

// next.js client side 용 (client component 에서 사용)
export function useFetcher() {
  const createFetchInstance = (url: string, requestInit?: RequestInit) => {
    return fetchInstance({
      url,
      requestInit,
      preProcesser: async () => {
        return {
          headers: {
            Authorization: `Bearer ${Cookies.get('access_token')}`,
          },
        };
      },
    });
  };

  return { createFetchInstance };
}
