'use client'

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();

  useEffect(() => {
    console.log('@@@searchParams', searchParams);
    
  }, [searchParams]);

  return (
    <>
      hi
    </>
  );
}