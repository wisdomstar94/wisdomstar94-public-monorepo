import "./globals.css";
import { CommonRootLayout, ICommonRootLayout } from "@wisdomstar94/packages-common-lib/index";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: ICommonRootLayout.MenuItem[] = [
    { name: 'test/react-add-event-listener', href: '/test/react-add-event-listener' },
    { name: 'test/react-add-event-listener2', href: '/test/react-add-event-listener2' },
    { name: 'test/react-indexeddb-manager/basic', href: '/test/react-indexeddb-manager/basic' },
    { name: 'test/react-indexeddb-manager/sync-get-and-delete-test', href: '/test/react-indexeddb-manager/sync-get-and-delete-test' },
  ];

  return (
    <CommonRootLayout menus={menus}>
      { children }
    </CommonRootLayout>
  );
}
