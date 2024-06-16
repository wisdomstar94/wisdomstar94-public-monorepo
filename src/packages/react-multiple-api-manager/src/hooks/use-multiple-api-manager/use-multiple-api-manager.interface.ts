export declare namespace IUseMultipleApiManager {
  export interface ApiItem {
    key: string;
    retryCount: number;
    initDelay?: number;
    retryedCount?: number;
    isComplete?: boolean;
    isSuccess?: boolean;
    data?: any;
    fn: () => Fetcher;
    _fetcher?: Fetcher;
  }

  export interface Fetcher {
    fetch: () => Promise<any>;
    cancel?: () => Promise<any>;
  }

  export interface FetchOptions {
    onComplete?: (apiItems: IUseMultipleApiManager.ApiItem[]) => void;
    onError?: (targetApiItem: IUseMultipleApiManager.ApiItem, error: any) => void;
  }

  export interface Props {
    
  }
}