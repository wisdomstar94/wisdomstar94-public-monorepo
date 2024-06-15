import { IUseAddEventListener } from "./use-add-event-listener.interface";
export declare function useAddEventListener<K extends keyof HTMLElementEventMap, T extends keyof WindowEventMap>(props: IUseAddEventListener.Props<K, T>): {};
