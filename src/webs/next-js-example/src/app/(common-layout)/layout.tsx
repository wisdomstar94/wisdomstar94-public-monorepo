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
  ];

  return (
    <CommonRootLayout menus={menus}>
      { children }
    </CommonRootLayout>
  );
}
