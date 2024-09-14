import { CommonRootLayout, ICommonRootLayout } from '#packages-common-lib';

export default function Layout({
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
    { name: 'test/react-socketio-manager', href: '/test/react-socketio-manager' },
    { name: 'test/react-web-rtc-manager', href: '/test/react-web-rtc-manager' },
    { name: 'test/ipaddr.js', href: '/test/ipaddr.js' },
    { name: 'test/next-utils', href: '/test/next-utils' },
    { name: 'test/react-scroll-effect', href: '/test/react-scroll-effect' },
    { name: 'test/react-scroll-effect-2', href: '/test/react-scroll-effect-2' },
    { name: 'test/react-scroll-effect-3', href: '/test/react-scroll-effect-3' },

    // test/vanilla-js-util
    { name: 'test/vanilla-js-util/apply-overlay-scroll', href: '/test/vanilla-js-util/apply-overlay-scroll' },
    { name: 'test/vanilla-js-util/set-position-target-element', href: '/test/vanilla-js-util/set-position-target-element' },
    { name: 'test/vanilla-js-util/get-info-by-scroll', href: '/test/vanilla-js-util/get-info-by-scroll' },
  ];

  return <CommonRootLayout menus={menus}>{children}</CommonRootLayout>;
}
