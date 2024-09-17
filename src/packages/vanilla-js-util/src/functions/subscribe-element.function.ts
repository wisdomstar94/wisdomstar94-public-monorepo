export type SubscribeElementParams<T extends HTMLElement> = {
  target: T;
  options?: MutationObserverInit;
  callback: MutationCallback;
};

export function subscribeElement<T extends HTMLElement>(params: SubscribeElementParams<T>) {
  const { target, options, callback } = params;
  const observer = new MutationObserver(callback);
  observer.observe(target, options);
  return observer;
}
