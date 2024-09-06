import { CommonRootLayout, ICommonRootLayout } from '#packages-common-lib';
import { ReactNode } from 'react';

export default function Layout(props: { children: ReactNode }) {
  const menus: ICommonRootLayout.MenuItem[] = [
    { name: '/test/button', href: '/test/button' },
    { name: '/test/carousel', href: '/test/carousel' },
    { name: '/test/shadcn-ui-sidebar', href: '/test/shadcn-ui-sidebar' },
  ];
  return <CommonRootLayout menus={menus}>{props.children}</CommonRootLayout>;
}
