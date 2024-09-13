import { splitClassName } from './split-class-name.function';

export function applyClassNameToElement<T extends HTMLElement>(element: T, className: string | undefined) {
  if (typeof className !== 'string') return;
  const classNames = splitClassName(className);
  for (const cn of classNames) {
    element.classList.add(cn);
  }
  return classNames;
}
