import { Button } from '@/components/ui/button';
import { FC } from 'react';

const Page: FC = () => {
  return (
    <>
      <Button>버튼 입니다.</Button>
      <Button variant="secondary">버튼 입니다.</Button>
      <Button variant="outline">버튼 입니다.</Button>
      <Button size="sm">버튼 입니다.</Button>
    </>
  );
};

export default Page;
