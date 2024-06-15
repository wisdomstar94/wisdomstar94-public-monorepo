export declare namespace IUseAddEventListener {
    type SelectorString = `selector:${string}`;
    type Target = {
        current: any;
    } | SelectorString;
    interface DomEventRequiredInfo<K extends keyof HTMLElementEventMap> {
        target: Target;
        eventName: K;
        eventListener: (event: HTMLElementEventMap[K]) => any;
        options?: boolean | AddEventListenerOptions;
    }
    interface WindowEventRequiredInfo<T extends keyof WindowEventMap> {
        eventName: T;
        eventListener: (event: WindowEventMap[T]) => any;
        options?: boolean | AddEventListenerOptions;
    }
    interface Props<K extends keyof HTMLElementEventMap, T extends keyof WindowEventMap> {
        domEventRequiredInfo?: DomEventRequiredInfo<K>;
        windowEventRequiredInfo?: WindowEventRequiredInfo<T>;
    }
}
