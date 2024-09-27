export type PreProcesserReturnParams = {
  headers?: Record<string, string>;
};

export type FetchInstanceParams = {
  url: string;
  requestInit?: RequestInit;
  preProcesser?: () => Promise<PreProcesserReturnParams>; // 서버 사이드 또는 클라이언트 사이드에서 요청 전 특정 조작이 필요할 경우 사용
};

export function fetchInstance(params: FetchInstanceParams) {
  const { url, requestInit, preProcesser } = params;

  const call = async () => {
    const requestInitClone = { ...requestInit };

    if (typeof preProcesser === 'function') {
      const preProcesserParams = await preProcesser();
      // 요청 전 헤더 조작
      if (preProcesserParams.headers !== undefined) {
        const headersClone = new Headers(requestInitClone.headers);
        for (const [key, value] of Object.entries(preProcesserParams.headers)) {
          headersClone.append(key, value);
        }
        requestInitClone.headers = headersClone;
      }
    }

    return fetch(url, requestInitClone);
  };

  return {
    call,
  };
}
