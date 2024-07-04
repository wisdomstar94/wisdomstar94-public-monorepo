import "./globals.css";
import { CommonRootLayout, ICommonRootLayout } from "#packages-common-lib";
import { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
  title: "ant-design-example",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: ICommonRootLayout.MenuItem[] = [
    { name: "test/grid", href: "/test/grid" },
  ];

  return (
    <AntdRegistry>
      <CommonRootLayout menus={menus}>
        { children }
      </CommonRootLayout>
    </AntdRegistry>
  );
}
