import { CommonRootLayout, ICommonRootLayout } from "#packages-common-lib";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: ICommonRootLayout.MenuItem[] = [
    { name: 'test/other-character-add', href: '/test/other-character-add' },
    { name: 'test/socket-apply', href: '/test/socket-apply' },
    { name: 'test/socket-apply-v2', href: '/test/socket-apply-v2' },
  ];

  return (
    <CommonRootLayout menus={menus}>
      { children }
    </CommonRootLayout>
  );
}
