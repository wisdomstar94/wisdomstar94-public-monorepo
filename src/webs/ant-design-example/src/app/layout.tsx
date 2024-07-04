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
    { name: "/test/grid-responsive", href: "/test/grid-responsive" },
    { name: "/test/grid-offset", href: "/test/grid-offset" },
    { name: "/test/grid-pull-push", href: "/test/grid-pull-push" },
    { name: "/test/grid-order", href: "/test/grid-order" },
    { name: "/test/grid-flex", href: "/test/grid-flex" },
    { name: "/test/grid-fix-and-auto", href: "/test/grid-fix-and-auto" },
    { name: "/test/space", href: "/test/space" },
    { name: "/test/space-vertical", href: "/test/space-vertical" },
    { name: "/test/space-gap", href: "/test/space-gap" },
    { name: "/test/space-wrap", href: "/test/space-wrap" },
    { name: "/test/space-align", href: "/test/space-align" },
    { name: "/test/space-split", href: "/test/space-split" },
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
