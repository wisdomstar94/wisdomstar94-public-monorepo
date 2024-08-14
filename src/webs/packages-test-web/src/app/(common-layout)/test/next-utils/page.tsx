"use client"

import { generateUrlQueryString } from "@wisdomstar94/next-utils";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const newUrl = generateUrlQueryString({
      pathname,
      searchParams,
      items: [
        { key: 'name', value: ['hi'], mode: 'UPSERT' },
        { key: 'status', value: ['1', '10'], mode: 'UPSERT', isArray: true },
      ],
    });
    console.log('@newUrl', newUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>

    </>
  );
}