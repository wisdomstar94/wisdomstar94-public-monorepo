export type PreProcesserReturnParams = {
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
};

export type PostProcesserReturnParamsRetry = {
  type: 'retry';
  retry: FetchInstanceParams;
};
export type PostProcesserReturnParamsPass = {
  type: 'pass';
};
export type PostProcesserReturnParamsTransform = {
  type: 'transform';
  transform: unknown;
};

export type PostProcesserReturnParams = PostProcesserReturnParamsRetry | PostProcesserReturnParamsPass | PostProcesserReturnParamsTransform;

export type FetchInstanceParams = {
  url: string;
  requestInit?: RequestInit;
  preProcesser?: () => Promise<PreProcesserReturnParams>; // 서버 사이드 또는 클라이언트 사이드에서 요청 전 특정 조작이 필요할 경우 사용
  postProcesser?: (url: string, requestInit: RequestInit, res: Response) => Promise<PostProcesserReturnParams>;
};

export function fetchInstance(params: FetchInstanceParams) {
  const { url, requestInit, preProcesser, postProcesser } = params;

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
      // 요청 전 credentials 조작
      if (preProcesserParams.credentials !== undefined) {
        requestInitClone.credentials = preProcesserParams.credentials;
      }
    }

    return fetch(url, requestInitClone).then(async (res) => {
      if (typeof postProcesser !== 'function') {
        return res;
      }
      const result = await postProcesser(url, requestInitClone, res);
      if (result === null || result === undefined) return res;

      if (result.type === 'pass') {
        return res;
      }

      if (result.type === 'transform') {
        return result.transform;
      }

      const { retry } = result;
      return fetch(retry.url, retry.requestInit);
    });
  };

  return {
    call,
  };
}
