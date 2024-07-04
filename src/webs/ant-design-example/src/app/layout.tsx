import "./globals.css";
import { CommonRootLayout, ICommonRootLayout } from "#packages-common-lib";
import { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from 'antd';
import { theme } from "@/theme/theme.config";

export const metadata: Metadata = {
  title: "ant-design-example",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: ICommonRootLayout.MenuItem[] = [
    { name: "/test/grid", href: "/test/grid" },
  ];

  return (
    <AntdRegistry>
      <ConfigProvider theme={theme}>
        <CommonRootLayout menus={menus}>
          { children }
        </CommonRootLayout>
      </ConfigProvider>
    </AntdRegistry>
  );
}
