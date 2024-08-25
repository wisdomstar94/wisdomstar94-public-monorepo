import { z } from 'zod';

export function isValidEmail(value: string): boolean {
  const schema = z.string().email();
  const result = schema.safeParse(value);
  return result.success;
}

export function isValidDate(value: string): boolean {
  const schema = z.string().date();
  const result = schema.safeParse(value);
  return result.success;
}

export function isValidTime(value: string): boolean {
  const schema = z.string().time();
  const result = schema.safeParse(value);
  return result.success;
}

export function isValidDateTime(value: string): boolean {
  const schema = z.string().datetime();
  const result = schema.safeParse(value);
  return result.success;
}
