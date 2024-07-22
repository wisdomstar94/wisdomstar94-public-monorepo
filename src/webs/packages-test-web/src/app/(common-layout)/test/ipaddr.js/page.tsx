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

const isMatched = (targetIp: string, format: string) => {
  const formatSplit = format.split('/');
  const formatIp = formatSplit[0];
  const formatBit = Number(formatSplit[1]);

  const parseFormatIp = ipaddr.parse(formatIp);
  const parseTargetIp = ipaddr.parse(targetIp);

  const isMatch = parseFormatIp.match(parseTargetIp, formatBit);
  console.log('@isMatch', isMatch);

  return true;
};

export default function Page() {
  useEffect(() => {
    isMatched('181.141.21.255', '181.141.21.0/24');
    // isMatched('181.141.21.999', '181.141.21.0/24'); // throw error 발생됨!
  }, []);

  return (
    <>

    </>
  );
}