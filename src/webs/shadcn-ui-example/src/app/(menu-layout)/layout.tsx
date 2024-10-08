import { CommonRootLayout, ICommonRootLayout } from '#packages-common-lib';
import { ReactNode } from 'react';

export default function Layout(props: { children: ReactNode }) {
  const menus: ICommonRootLayout.MenuItem[] = [
    { name: '/test/button', href: '/test/button' },
    { name: '/test/carousel', href: '/test/carousel' },
    { name: '/test/shadcn-ui-sidebar', href: '/test/shadcn-ui-sidebar' },
    { name: '/test/context-menu', href: '/test/context-menu' },
    { name: '/test/menubar', href: '/test/menubar' },
    { name: '/test/popover', href: '/test/popover' },
    { name: '/test/content-drop-down', href: '/test/content-drop-down' },
    { name: '/test/vertical-tab', href: '/test/vertical-tab' },
    { name: '/test/vertical-tab-custom', href: '/test/vertical-tab-custom' },
  ];
  return <CommonRootLayout menus={menus}>{props.children}</CommonRootLayout>;
}
