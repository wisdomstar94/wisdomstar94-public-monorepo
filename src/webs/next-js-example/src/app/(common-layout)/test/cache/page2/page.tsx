import { CacheTestServer } from "@/components/test/cache-test-server/cache-test-server.component";
import { Suspense } from "react";

export const dynamic: NextRouteSegmentConfigDynamic = 'force-dynamic';
export const revalidate: NextRouteSegmentConfigRevalidate = 0;

export default function Page() {
  return (
    <>
      <div>Page 2</div>
      <Suspense fallback={<>loading...</>}>
        <CacheTestServer />
      </Suspense>
    </>
  );
}