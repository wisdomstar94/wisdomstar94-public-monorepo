import { useEffect, useRef, useState } from "react";
import { UseApiCanceledData, UseApiFetchOptions, UseApiInfo, UseApiProps } from "./use-api.interface";

export function useApi<T>(props: UseApiProps<T>) {
  const {
    api,
    autoFetchDependencies,
  } = props;
  const enabled = props.enabled ?? true;
  const enabledAutoFetch = props.enabledAutoFetch ?? true;
  const retryCountDefault = props.retryCount;
  const retryDelayDefault = props.retryDelay;

  const isLoadingRef = useRef(false);
  const isCancelRef = useRef(false);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [data, setData] = useState<T>();
  const [canceled, setCanceled] = useState<UseApiCanceledData>();

  const apis = useRef<UseApiInfo<T>>(api());
  const retryTimer = useRef<NodeJS.Timeout>();
  
  const clearRetryTimer = () => {
    clearTimeout(retryTimer.current);
    retryTimer.current = undefined;
  };

  const fetch = (options?: UseApiFetchOptions) => {
    if (isLoadingRef.current) return;
    if (!enabled) return;

    apis.current = api();
    setIsLoadingDispose(true);

    const retryCount = options?.retryCount ?? (retryCountDefault ?? 0);
    const retryDelay = options?.retryDelay ?? (retryDelayDefault);

    let retriedCount = 0;
    isCancelRef.current = false;

    const call = () => {
      apis.current.fn().then((result) => {
        setData(result);
        if (isFetched === false) setIsFetched(true);
        setIsLoadingDispose(false);
      }).catch((error) => {
        if (!isCancelRef.current && retriedCount < retryCount) {
          retriedCount++;
          if (retryDelay === undefined) {
            call();
          } else {
            retryTimer.current = setTimeout(() => {
              call();
            }, retryDelay);
          }
          return;
        }
        isCancelRef.current = false;
        setError(error);
        setIsLoadingDispose(false);
      });
    };
    call();
  };

  const cancel = () => {
    if (!isLoadingRef.current) return;
    if (typeof apis.current.cancel === 'function') {
      isCancelRef.current = true;
      apis.current.cancel();
      setIsLoadingDispose(false);
      clearRetryTimer();
      setCanceled({ date: new Date() });
    }
  };

  const setIsLoadingDispose = (v: boolean) => {
    isLoadingRef.current = v;
    setIsLoading(v);
  };

  useEffect(() => {
    if (enabledAutoFetch) fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, autoFetchDependencies ?? []);

  return {
    isFetched,
    isLoading,
    error,
    data,
    canceled,
    fetch,
    cancel,
  };
}