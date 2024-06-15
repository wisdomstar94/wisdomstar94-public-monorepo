export declare namespace IUseAddEventListener {
  export type SelectorString = `selector:${string}`;

  export type Target = { current: any } | SelectorString;

  export interface DomEventRequiredInfo<K extends keyof HTMLElementEventMap> {
    target: Target;
    eventName: K;
    eventListener: (event: HTMLElementEventMap[K]) => any;
    options?: boolean | AddEventListenerOptions;
  }

  export interface WindowEventRequiredInfo<T extends keyof WindowEventMap> {
    eventName: T;
    eventListener: (event: WindowEventMap[T]) => any;
    options?: boolean | AddEventListenerOptions;
  }

  export interface Props<K extends keyof HTMLElementEventMap, T extends keyof WindowEventMap> {
    domEventRequiredInfo?: DomEventRequiredInfo<K>;
    windowEventRequiredInfo?: WindowEventRequiredInfo<T>;
  }
}