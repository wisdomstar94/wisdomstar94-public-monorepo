import { MainLayout } from '@/components/layouts/main-layout/main-layout.component';
import { ReactNode } from 'react';

export default function Layout(props: { children: ReactNode }) {
  const { children } = props;
  return <MainLayout>{children}</MainLayout>;
}
