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
    { name: 'test/basic', href: '/test/basic' },
  ];

  return (
    <CommonRootLayout menus={menus}>
      { children }
    </CommonRootLayout>
  );
}