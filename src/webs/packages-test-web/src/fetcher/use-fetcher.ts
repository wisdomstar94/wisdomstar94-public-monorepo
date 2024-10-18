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
      postProcesser: async (url, requestInit, res) => {
        console.log('@postProcesser', { url, requestInit, res });
        return {
          type: 'retry',
          retry: {
            url: url + '&timestamp=' + new Date().getTime(),
            requestInit,
          },
        };
      },
    });
  };

  return { createFetchInstance };
}
