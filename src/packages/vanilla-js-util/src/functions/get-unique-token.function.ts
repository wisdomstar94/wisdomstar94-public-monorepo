import { getRandomNumber } from './get-random-number.function';
import { getRandomString } from './get-random-string.function';

export function getUniqueToken(strLength: number): string {
  const timestamp = new Date().getTime();
  const timestamp_length = timestamp.toString().length;
  const str_max_length = strLength - timestamp_length;
  const first_length = getRandomNumber(1, str_max_length);
  const second_length = str_max_length - first_length;
  const token = ''.concat(getRandomString(first_length), new Date().getTime().toString(), getRandomString(second_length));
  return token;
}
