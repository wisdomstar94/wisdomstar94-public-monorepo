export function classes(...args: (string | undefined)[]) {
  const classNames: string[] = [];
  for (const item of args) {
    if (typeof item === 'string') {
      classNames.push(item);
    }
  }
  return classNames.join(' ');
}