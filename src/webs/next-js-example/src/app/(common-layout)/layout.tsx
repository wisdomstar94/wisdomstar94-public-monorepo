import { CommonRootLayout, ICommonRootLayout } from "#packages-common-lib";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: ICommonRootLayout.MenuItem[] = [
    { name: 'test/use-id', href: '/test/use-id' },
    { name: 'test/use-transition/yes', href: '/test/use-transition/yes' },
    { name: 'test/use-transition/no', href: '/test/use-transition/no' },
    { name: 'test/use-transition/with-suspense', href: '/test/use-transition/with-suspense' },
    { name: 'test/use-layout-effect', href: '/test/use-layout-effect' },
    { name: 'test/use-sync-external-store', href: '/test/use-sync-external-store' },
    { name: 'test/use-reducer/basic', href: '/test/use-reducer/basic' },
    { name: 'test/use-optimistic', href: '/test/use-optimistic' },
  ];

  return (
    <CommonRootLayout menus={menus}>
      { children }
    </CommonRootLayout>
  );
}
