"use client"

import { logger } from "@/logger/logger";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    logger.debug('hi~~');
  }, []);

  return (
    <>
      /test/winston
    </>
  );
}