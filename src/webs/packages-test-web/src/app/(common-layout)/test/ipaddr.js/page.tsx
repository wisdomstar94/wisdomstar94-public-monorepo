"use client"

import { useEffect } from "react";
import ipaddr from 'ipaddr.js';

const getIpType = (format: string): 'range' | 'cidr' | 'onece' => {
  const formatSplit = format.split('/');
  if (formatSplit.length === 1) {
    const temp = formatSplit[0];
    const tempSplit1 = temp.split('-');
    const tempSplit2 = temp.split('~');
    return 'onece';
  } 
  
  if (formatSplit.length === 2) {
    return 'cidr';
  } 
  
  throw new Error(`@`);
};

const isIpMatch = (params: { ip: string; format: string; }) => {
  const { ip, format } = params;
  const formatSplit = format.split('/');
  const formatIp = formatSplit[0];
  const formatBit = Number(formatSplit[1]);

  const parseFormatIp = ipaddr.parse(formatIp);
  const parseIp = ipaddr.parse(ip);

  const isMatch = parseFormatIp.match(parseIp, formatBit);

  return isMatch;
};

export default function Page() {
  useEffect(() => {
    const isMatch1 = isIpMatch({
      ip: '181.141.21.255', 
      format: '181.141.21.0/24'
    });
    console.log('@isMatch1', isMatch1);
    
    const isMatch2 = isIpMatch({
      ip: '2001:ffff:ffff:ffff:ffff:ffff:ffff:ffff', 
      format: '2001::/16'
    });
    console.log('@isMatch2', isMatch2);
  }, []);

  return (
    <>

    </>
  );
}