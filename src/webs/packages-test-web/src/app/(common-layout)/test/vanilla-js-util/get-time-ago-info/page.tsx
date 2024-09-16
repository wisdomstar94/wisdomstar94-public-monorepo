'use client';

import { getTimeAgoInfo } from '@wisdomstar94/vanilla-js-util';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    // console.log(getTimeAgoInfo(new Date('2024-09-16 20:46:11')));
    // console.log(getTimeAgoInfo(new Date('2024-09-16 19:46:11')));
    console.log(getTimeAgoInfo(new Date('2024-07-15 19:46:11')));
    console.log(getTimeAgoInfo(new Date('2024-07-15 19:46:11'), { isMoreDetail: false }));
  }, []);

  return <></>;
}
