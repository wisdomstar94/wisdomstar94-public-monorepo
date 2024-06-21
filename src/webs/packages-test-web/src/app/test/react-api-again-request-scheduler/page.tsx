"use client"
import axios from "axios";
import { useCallback, useEffect } from "react";
import { DateTime } from 'luxon';
import { useApiAgainRequestScheduler } from "@wisdomstar94/react-api-again-request-scheduler";

export default function Page() {
  const apiAgainRequestScheduler = useApiAgainRequestScheduler();

  const apiRequest1 = useCallback(() => {
    const url = `http://localhost:8000/test/random/error`;
    const data = {
      'a': 'b',
    };

    apiAgainRequestScheduler.holdApi({
      key: url + JSON.stringify(data),
      url: url,
      method: 'get',
      requestDataType: 'query-string',
      data: data,
      headers: {
        'test1': 'zzzzzzzzz',
      },
      retryIntervalMillisecond: 1000,
      expiredDate: DateTime.now().plus({ second: 50 }).toJSDate(),
    }, (apiItem) => {
      axios({
        url: apiItem.url,
        method: apiItem.method,
        data: apiItem.requestDataType === 'body' ? apiItem.data : undefined,
        params: apiItem.requestDataType === 'query-string' ? apiItem.data : undefined,
        timeout: 4000,
      }).then(res => {
        apiAgainRequestScheduler.holdCancelApi(apiItem.key);
      }).catch(error => {
        apiAgainRequestScheduler.holdCancelApi(apiItem.key);
        apiAgainRequestScheduler.saveApi([apiItem]);
      });
    });
  }, [apiAgainRequestScheduler]);

  const apiRequest2 = useCallback(() => {
    const url = `http://localhost:8000/test/random/error2`;
    const data = {
      'c': 'd',
    };

    apiAgainRequestScheduler.holdApi({
      key: url + JSON.stringify(data),
      url: url,
      method: 'get',
      requestDataType: 'query-string',
      data: data,
      headers: {
        'test2': 'zzzzzzzzz',
      },
      retryIntervalMillisecond: 1000,
      expiredDate: DateTime.now().plus({ second: 30 }).toJSDate(),
    }, (apiItem) => {
      axios({
        url: apiItem.url,
        method: apiItem.method,
        data: apiItem.requestDataType === 'body' ? apiItem.data : undefined,
        params: apiItem.requestDataType === 'query-string' ? apiItem.data : undefined,
        timeout: 4000,
      }).then(res => {
        apiAgainRequestScheduler.holdCancelApi(apiItem.key);
      }).catch(error => {
        apiAgainRequestScheduler.holdCancelApi(apiItem.key);
        apiAgainRequestScheduler.saveApi([apiItem]);
      });
    });
  }, [apiAgainRequestScheduler]);

  useEffect(() => {
    if (!apiAgainRequestScheduler.isReady) return;
    apiAgainRequestScheduler.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiAgainRequestScheduler.isReady]);

  return (
    <>
      <div>
        <button onClick={apiRequest1}>api 요청하기</button>
        <button onClick={apiRequest2}>api 2 요청하기</button>
      </div>
      <div>
        <button onClick={() => apiAgainRequestScheduler.start()}>스케줄러 돌리기</button>
        <button onClick={() => apiAgainRequestScheduler.stop()}>스케줄러 멈추기</button>
      </div>
      <div className="w-10 h-10 bg-red-500">

      </div>
    </>
  );
}
