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
    { name: 'test/react-multiple-api-manager', href: '/test/react-multiple-api-manager' },
    { name: 'test/react-api', href: '/test/react-api' },
    { name: 'test/react-promise-interval', href: '/test/react-promise-interval' },
    { name: 'test/react-body', href: '/test/react-body' },
  ];

  return (
    <CommonRootLayout menus={menus}>
      { children }
    </CommonRootLayout>
  );
}
