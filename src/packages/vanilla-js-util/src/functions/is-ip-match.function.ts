import { parse } from 'ipaddr.js';

export type IsIpMatchParams = {
  ip: string;
  format: string;
};

export const isIpMatch = (params: IsIpMatchParams) => {
  const { ip, format } = params;
  const formatSplit = format.split('/');
  const formatIp = formatSplit[0];
  const formatBit = Number(formatSplit[1]);

  const parseFormatIp = parse(formatIp);
  const parseIp = parse(ip);

  const isMatch = parseFormatIp.match(parseIp, formatBit);

  return isMatch;
};
