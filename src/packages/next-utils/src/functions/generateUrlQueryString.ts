import { ReadonlyURLSearchParams } from 'next/navigation';

export type UrlQueryStringItemMode = 'UPSERT' | 'DELETE' | 'TRUNCATE' | 'REPLACE';

export type UrlQueryStringItem = {
  key: string;
  value: [string] | string[];
  isArray?: boolean;
  mode: UrlQueryStringItemMode;
};

export type GenerateUrlQueryStringParams = {
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
  items: UrlQueryStringItem[];
};

export const generateUrlQueryString = (params: GenerateUrlQueryStringParams) => {
  const { pathname, searchParams, items } = params;

  const itemsKeys = items.map((k) => k.key);
  const truncateKeys = items.filter((k) => k.mode === 'TRUNCATE').map((k) => k.key);

  const keyAndValues: `${string}=${string}`[] = [];

  searchParams.forEach((value, key) => {
    if (itemsKeys.includes(key)) {
      return;
    }
    if (truncateKeys.includes(key)) {
      return;
    }
    keyAndValues.push(`${key}=${value}`);
  });

  for (const item of items) {
    const { key, value, isArray, mode } = item;
    if (truncateKeys.includes(key)) {
      continue;
    }

    if (isArray === true) {
      const originalValues = searchParams.getAll(key);
      let convertValues = [...originalValues];
      if (mode === 'UPSERT') {
        convertValues = convertValues.concat(value);
        convertValues = Array.from(new Set(convertValues));
      } else if (mode === 'DELETE') {
        convertValues = convertValues.filter((x) => !value.includes(x));
      } else if (mode === 'REPLACE') {
        convertValues = value;
      }
      for (const v of convertValues) {
        keyAndValues.push(`${key}=${v}`);
      }
    } else {
      keyAndValues.push(`${key}=${value}`);
    }
  }

  return `${pathname}?${keyAndValues.join('&')}`;
};
