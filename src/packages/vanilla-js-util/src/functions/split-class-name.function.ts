export function splitClassName(className: string): string[] {
  const splitItems = className.split(' ');
  const result = splitItems.filter((x) => x.trim() !== '');
  return result;
}
