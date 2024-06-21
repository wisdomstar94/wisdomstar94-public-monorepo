import { Method } from "axios";

export declare namespace IUseApiAgainRequestScheduler {
  export type RequestDataType = 'body' | 'query-string';

  export interface SaveApiItem {
    key: string;
    url: string;
    method: Method;
    headers: Record<string, string>;
    data: Record<string, string | number>;
    requestDataType: RequestDataType;
    retryIntervalMillisecond: number;
    expiredDate: Date;
  }

  export interface RetrySuccessInfo {
    apiItem: SaveApiItem;
    responseBody: any;
  }

  export interface RetryIntervalInfo {
    item: SaveApiItem;
    interval: NodeJS.Timeout;
    /** retryCount 는 재시도 횟수이자 재시도 실패 횟수입니다. */
    retryCount: number;
    isFetching: boolean;
  }

  export interface Props {
    
  }
}