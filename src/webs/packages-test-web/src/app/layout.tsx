import "./globals.css";
import { CommonRootLayout, ICommonRootLayout } from "#packages-common-lib";

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
    { name: 'test/react-api-again-request-scheduler', href: '/test/react-api-again-request-scheduler' },
    { name: 'test/react-request-animation-frame-manager', href: '/test/react-request-animation-frame-manager' },
    { name: 'test/react-joystick', href: '/test/react-joystick' },
    { name: 'test/react-keyboard-manager', href: '/test/react-keyboard-manager' },
    { name: 'test/react-touch-container', href: '/test/react-touch-container' },
  ];

  return (
    <CommonRootLayout menus={menus}>
      { children }
    </CommonRootLayout>
  );
}
