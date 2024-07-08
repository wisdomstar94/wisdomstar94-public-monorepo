"use client";

import { useNetwork } from "@/hooks/use-network/use-network.hook";

export default function Page() {
  const network = useNetwork();

  return (
    <>
      { network.isOnline ? <span className="text-blue-500">online</span> : <span className="text-red-500">offline</span> }
    </>
  );
}