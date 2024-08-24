export type AllowClassesType = string | undefined | null | boolean;

export function classes(...args: (AllowClassesType | AllowClassesType[])[]) {
  let classList: string[] = [];
  for (const item of args) {
    if (Array.isArray(item)) {
      classList = classList.concat(item.filter((x) => typeof x === 'string'));
    } else {
      if (typeof item === 'string') {
        classList.push(item);
      }
    }
  }
  return classList.join(' ');
}
