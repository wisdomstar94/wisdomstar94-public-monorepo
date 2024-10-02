import { fetchInstance } from '@wisdomstar94/vanilla-js-util';
import { cookies } from 'next/headers';

// next.js server side 용 (server component, server action 에서 사용)
export function createFetchInstance(url: string, requestInit?: RequestInit) {
  const cookie = cookies();

  return fetchInstance({
    url,
    requestInit,
    preProcesser: async () => {
      return {
        headers: {
          Authorization: `Bearer ${cookie.get('access_token')}`,
        },
      };
    },
  });
}
