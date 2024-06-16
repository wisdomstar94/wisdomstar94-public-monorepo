import { useCallback, useRef, useState } from "react";
import { IUseMultipleApiManager } from "./use-multiple-api-manager.interface";

export function useMultipleApiManager() {
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canceledInfo, setCanceledInfo] = useState<{ dataSet: IUseMultipleApiManager.ApiItem[] }>();
  const isLoadingRef = useRef<boolean>(false);
  const [dataSet, setDataSet] = useState<IUseMultipleApiManager.ApiItem[]>();
  const apiItemsNow = useRef<IUseMultipleApiManager.ApiItem[]>([]);
  const delayTimers = useRef<NodeJS.Timeout[]>([]);

  const isComplete = useCallback((apiItems: IUseMultipleApiManager.ApiItem[]) => apiItems.find(x => x.isComplete !== true) === undefined, []);

  const cancel = useCallback(() => {
    delayTimers.current.forEach((item) => clearTimeout(item));
    apiItemsNow.current.forEach((item) => {
      const cancel = item._fetcher?.cancel;
      if (typeof cancel === 'function') {
        console.log('@_fetcher.cancel()!!');
        cancel();
      }
    });
    isLoadingRef.current = false;
    setCanceledInfo({ dataSet: apiItemsNow.current });
  }, []);

  const fetch = useCallback((_apiItems: IUseMultipleApiManager.ApiItem[], options?: IUseMultipleApiManager.FetchOptions) => {
    if (isLoadingRef.current) return;
    if (_apiItems.length === 0) return;

    isLoadingRef.current = true;
    const apiItems = [..._apiItems];
    apiItemsNow.current = apiItems;
    apiItemsNow.current.forEach((item) => {
      item._fetcher = item.fn();
    });

    setIsLoading(true);

    delayTimers.current = [];

    function disposeFetch(item: IUseMultipleApiManager.ApiItem, index: number) {
      item._fetcher?.fetch().then((res) => {
        apiItemsNow.current.forEach(thisItem => {
          if (thisItem.key === item.key) {
            thisItem.isComplete = true;
            thisItem.isSuccess = true;
            thisItem.data = res;
          }
        });
      }).catch((error) => {
        if (typeof options?.onError === 'function') {
          options.onError(item, error);
        }

        if ((item.retryedCount ?? 0) < item.retryCount) {
          item.retryedCount = (item.retryedCount ?? 0) + 1;
          disposeFetch(item, index);
        } else {
          apiItemsNow.current.forEach(thisItem => {
            if (thisItem.key === item.key) {
              thisItem.isComplete = true;
              thisItem.isSuccess = false;
            }
          });
        }
      }).finally(() => {
        if (isComplete(apiItemsNow.current)) {
          if (typeof options?.onComplete === 'function') {
            options.onComplete(apiItemsNow.current);
          }
          isLoadingRef.current = false;
          setIsLoading(false);
          setIsFetched(true);
          setDataSet(apiItemsNow.current);
        }
      });
    }

    apiItemsNow.current.forEach((item, index) => {
      if (isNumber(item.initDelay)) {
        delayTimers.current.push(setTimeout(() => {
          disposeFetch(item, index);
        }, item.initDelay));
      } else {
        disposeFetch(item, index);
      }
    });
  }, [isComplete]);

  return {
    isFetched,
    isLoading,
    dataSet,
    cancel,
    fetch,
    canceledInfo,
  };
}

function isNumber(value: any): value is number {
  if (typeof value !== 'number') return false;
  if (isNaN(value)) return false;
  return true;
}