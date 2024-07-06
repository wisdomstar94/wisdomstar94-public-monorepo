import "./globals.css";
import { CommonRootLayout, ICommonRootLayout } from "#packages-common-lib";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'babylon-js-example'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: ICommonRootLayout.MenuItem[] = [
    { name: 'test/other-character-add', href: '/test/other-character-add' },
    { name: 'test/socket-apply', href: '/test/socket-apply' },
    { name: 'test/rotation-research', href: '/test/rotation-research' },
  ];

  return (
    <CommonRootLayout menus={menus}>
      { children }
    </CommonRootLayout>
  );
}
