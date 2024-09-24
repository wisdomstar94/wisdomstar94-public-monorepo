'use client';

import { useLayoutEffect, useState } from 'react';

export default function Page() {
  const [number, setNumber] = useState(0);

  useLayoutEffect(() => {
    setNumber(100);

    return () => {
      setNumber(0);
    };
  }, []);

  return <>{number}</>;
}
