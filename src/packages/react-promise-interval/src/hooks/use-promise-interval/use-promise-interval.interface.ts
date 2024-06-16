export declare namespace IUsePromiseInterval {
  export interface PromiseStoreItem {
    interval: NodeJS.Timeout;
    promiseItem: PromiseItem;
  }

  export interface PromiseItem {
    key: string;
    promiseFn: () => Promise<any>;
    intervalMillsecond: number;
  }

  export interface StartOptions<DATA, TYPE> {
    type?: TYPE;
    success?: (result: DATA | undefined) => void;
    isNowCall?: boolean;
  }

  export interface AutoStart {
    enable: boolean;
    isNowCall?: boolean;
  }

  export interface Props<DATA, TYPE> {
    autoStart?: AutoStart;
    promiseFn: () => Promise<DATA | undefined>;
    types?: TYPE[];
    intervalMillsecond: number;
  }
}