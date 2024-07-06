import { IUseApiAgainRequestScheduler } from "./use-api-again-request-scheduler.interface";
import { defineSchemas, getDbVersion } from "./use-api-again-request-scheduler.schema";
import { useEffect, useRef, useState } from "react";
import axios, { AxiosHeaders } from "axios";
import { useIndexeddbManager } from "#react-indexeddb-manager";
import { usePromiseInterval } from "#react-promise-interval";

export function useApiAgainRequestScheduler(props?: IUseApiAgainRequestScheduler.Props) {
  const [isReady, setIsReady] = useState<boolean>(false);
  const retryIntervalInfos = useRef<Map<string, IUseApiAgainRequestScheduler.RetryIntervalInfo>>(new Map());
  const isStart = useRef<boolean>();
  const indexeddbManager = useIndexeddbManager({
    defineSchemas: defineSchemas,
    onDefineSchemasResult(result) {
      
    },
  }); 

  const initRetryIntervalInfosInterval = usePromiseInterval({
    intervalTime: 3000,
    fn: () => {
      return new Promise<boolean>(function(resolve, reject) {
        _initRetryIntervalInfos();
        resolve(false);
      });
    },
    isAutoStart: false,
    isCallWhenStarted: true,
    isForceCallWhenFnExecuting: true,
  });

  const [retrySuccessInfo, setRetrySuccessInfo] = useState<IUseApiAgainRequestScheduler.RetrySuccessInfo>();

  function _processing(key: string, data: (IUseApiAgainRequestScheduler.SaveApiItem & {
    key: string;
  } & Partial<{
    createdAt: number;
    updatedAt: number;
  }>)) {
    const target = retryIntervalInfos.current.get(key);
    if (target === undefined) return;
    if (target.isFetching) return;
    target.isFetching = true;
    axios({
      url: data.url,
      method: data.method,
      headers: new AxiosHeaders(data.headers),
      params: data.requestDataType === 'query-string' ? data.data : undefined,
      data: data.requestDataType === 'body' ? data.data : undefined,
      timeout: 1000 * 60,
    }).then(res => {
      target.isFetching = false;
      const _target = retryIntervalInfos.current.get(key);
      clearInterval(_target?.interval);
      retryIntervalInfos.current.delete(key);
      indexeddbManager.deletesToStore({
        dbName: 'api_again_request',
        storeName: 'api_again_request_list',
        version: getDbVersion('api_again_request'),
        deleteKeys: [key],
        onSuccess(result) {
          setRetrySuccessInfo({
            apiItem: target.item,
            responseBody: res.data,
          });
        },
        onError(event) {
          console.error(`에러 발생 일시:`, new Date());
          console.error('에러가 발생하였습니다.', event);
        },
      });
    }).catch((error) => {
      target.isFetching = false;
      console.error(`에러 발생 일시:`, new Date());
      console.error('api 요청 중 에러가 발생하였습니다.', error);
      target.retryCount++;
    });
  }

  function _initRetryIntervalInfos() {
    if (!isStart.current) return;
    indexeddbManager.getAllFromStore<IUseApiAgainRequestScheduler.SaveApiItem>({
      dbName: 'api_again_request',
      storeName: 'api_again_request_list',
      version: getDbVersion('api_again_request'),
      onResult(result) {
        // console.log('@@result', result);
        const existAndExpiredItems: IUseApiAgainRequestScheduler.SaveApiItem[] = [];

        for (const resultItem of result) {
          const {
            key,
            data,
          } = resultItem;

          if (data === undefined) continue;
          if (data === null) continue;

          const expiredDate = data.expiredDate;

          const retryIntervalInfo = retryIntervalInfos.current.get(key);
          if (retryIntervalInfo !== undefined) {
            // 이미 존재
            if (expiredDate.getTime() < Date.now()) {
              clearInterval(retryIntervalInfo.interval);
              retryIntervalInfos.current.delete(key);
              existAndExpiredItems.push(data);
            } else if (retryIntervalInfo.item.retryIntervalMillisecond !== data.retryIntervalMillisecond) {
              clearInterval(retryIntervalInfo.interval);
              retryIntervalInfo.interval = setInterval(() => {
                _processing(key, data);
              }, data.retryIntervalMillisecond);
            }
          } else {
            // 존재하지 않음
            if (expiredDate.getTime() < Date.now()) {
              existAndExpiredItems.push(data);
            } else {
              retryIntervalInfos.current.set(key, {
                item: data,
                interval: setInterval(() => {
                  _processing(key, data);
                }, data.retryIntervalMillisecond),
                retryCount: 0,
                isFetching: false,
              });
            }
          }
        }

        const deleteKeys = existAndExpiredItems.map(p => p.key);
        indexeddbManager.deletesToStore({
          dbName: `api_again_request`,
          version: getDbVersion(`api_again_request`),
          storeName: `api_again_request_list`,
          deleteKeys,
          onSuccess(result) {
            
          },
          onError(event) {
            
          },
        });
      },
      onError(event) {
        console.error(`에러 발생 일시:`, new Date());
        console.error(event);
      },
    });
  }

  function _onDatabaseDataUpdated() {
    _initRetryIntervalInfos();
  }

  function saveApi(items: IUseApiAgainRequestScheduler.SaveApiItem[], onSuccess?: () => void, onError?: (event: Event | undefined) => void) {
    indexeddbManager.insertToStore({
      dbName: 'api_again_request',
      storeName: 'api_again_request_list',
      version: getDbVersion('api_again_request'),
      isOverwrite: true,
      datas: items,
      onSuccess(result) {
        if (typeof onSuccess === 'function') {
          onSuccess();
        }
        _onDatabaseDataUpdated();
      },
      onError(event) {
        console.error(`에러 발생 일시:`, new Date());
        console.error(event);
        if (typeof onError === 'function') {
          onError(event);
        }
      },
    });
  }

  function holdApi(item: IUseApiAgainRequestScheduler.SaveApiItem, onSuccess: (item: IUseApiAgainRequestScheduler.SaveApiItem) => void, onError?: (event: Event | undefined) => void) {
    indexeddbManager.insertToStore({
      dbName: 'api_again_request',
      storeName: 'api_again_request_list_hold',
      version: getDbVersion('api_again_request'),
      isOverwrite: true,
      datas: [item],
      onSuccess(result) {
        onSuccess(item);
      },
      onError(event) {
        if (typeof onError === 'function') {
          onError(event);
        }
        console.error(`에러 발생 일시:`, new Date());
        console.error(event);
      },
    });
  }

  function holdCancelApi(key: string) {
    indexeddbManager.deletesToStore({
      dbName: 'api_again_request',
      storeName: 'api_again_request_list_hold',
      version: getDbVersion('api_again_request'),
      deleteKeys: [key],
      onSuccess(result) {
        
      },
      onError(event) {
        console.error(`에러 발생 일시:`, new Date());
        console.error('에러가 발생하였습니다.', event);
      },
    });
  }

  function nowAllRetry() {
    const entries = Array.from(retryIntervalInfos.current.entries());
    for (const [key, info] of entries) {
      const data = info.item;
      _processing(key, data);
    }
  }

  function start() {
    isStart.current = true;
    initRetryIntervalInfosInterval.start();
    _initRetryIntervalInfos();
  }

  function stop() {
    isStart.current = false;
    const entries = Array.from(retryIntervalInfos.current.entries());
    for (const [key, info] of entries) {
      clearInterval(info.interval);
      retryIntervalInfos.current.delete(key);
    }
  }

  useEffect(() => {
    if (indexeddbManager.isReady !== true) return;

    indexeddbManager.getAllFromStore<IUseApiAgainRequestScheduler.SaveApiItem>({
      dbName: 'api_again_request',
      storeName: 'api_again_request_list_hold',
      version: getDbVersion('api_again_request'),
      onResult(result) {
        const items: IUseApiAgainRequestScheduler.SaveApiItem[] = [];
        result.forEach((item) => {
          if (item.data !== undefined && item.data !== null) {
            items.push(item.data);
          }
        });

        if (items.length > 0) {
          saveApi(items, () => {
            indexeddbManager.clearStore({
              dbName: 'api_again_request',
              storeName: 'api_again_request_list_hold',
              version: getDbVersion('api_again_request'),
              onSuccess(event) {
                setIsReady(true);   
              },
              onError(event) {
                setIsReady(true);
              },
            });
          }, (event) => {
            setIsReady(true);
          });
        } else {
          setIsReady(true);
        }
      },
      onError(event) {
        console.error(`에러 발생 일시:`, new Date());
        console.error(event);
      },
    });
    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexeddbManager.isReady]);

  return {
    isReady,
    saveApi,
    nowAllRetry,
    holdApi,
    holdCancelApi,
    retrySuccessInfo,
    start,
    stop,
  };
}