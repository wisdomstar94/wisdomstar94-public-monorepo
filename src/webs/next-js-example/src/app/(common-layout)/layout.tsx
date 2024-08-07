import { CommonRootLayout, ICommonRootLayout } from "#packages-common-lib";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menus: ICommonRootLayout.MenuItem[] = [
    { name: 'test/use-id', href: '/test/use-id' },
    { name: 'test/use-transition/yes', href: '/test/use-transition/yes' },
    { name: 'test/use-transition/no', href: '/test/use-transition/no' },
    { name: 'test/use-transition/with-suspense', href: '/test/use-transition/with-suspense' },
    { name: 'test/use-layout-effect', href: '/test/use-layout-effect' },
    { name: 'test/use-sync-external-store', href: '/test/use-sync-external-store' },
    { name: 'test/use-reducer/basic', href: '/test/use-reducer/basic' },
    { name: 'test/use-optimistic', href: '/test/use-optimistic' },
    { name: 'test/server-action/basic', href: '/test/server-action/basic' },
    { name: 'test/api-call/basic', href: '/test/api-call/basic' },
    { name: 'test/parallel-routes-and-intercepting-routes', href: '/test/parallel-routes-and-intercepting-routes' },
    { name: 'test/image-response', href: '/test/image-response' },
    { name: 'test/route-segment-config-test/page1', href: '/test/route-segment-config-test/page1' },
    { name: 'test/route-segment-config-test/page2', href: '/test/route-segment-config-test/page2' },
    { name: 'test/template-test-page-1', href: '/test/template-test-page-1' },
    { name: 'test/template-test-page-2', href: '/test/template-test-page-2' },
    { name: 'test/template-test-page-3/t1/t2', href: '/test/template-test-page-3/t1/t2' },
    { name: 'test/winston', href: '/test/winston' },
    { name: 'test/winston', href: '/test/winston' },
    { name: 'test/cache/page1', href: '/test/cache/page1' },
    { name: 'test/cache/page2', href: '/test/cache/page2' },
    { name: 'test2', href: '/test2' },
    { name: 'test2/t1', href: '/test2/t1' },
  ];

  return (
    <CommonRootLayout menus={menus}>
      { children }
    </CommonRootLayout>
  );
}
