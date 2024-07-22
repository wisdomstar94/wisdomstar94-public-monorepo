import { ReactNode } from "react";

export const dynamic: NextRouteSegmentConfigDynamic = 'auto';
export const dynamicParams: NextRouteSegmentConfigDynamicParams = true;
export const revalidate: NextRouteSegmentConfigRevalidate = false;
export const fetchCache: NextRouteSegmentConfigFetchCache = 'auto';
export const runtime: NextRouteSegmentConfigRuntime = 'nodejs';
export const preferredRegion: NextRouteSegmentConfigPreferredRegion = 'auto';
export const maxDuration: NextRouteSegmentConfigMaxDuration = 5;

export default async function Layout(props: { children: ReactNode }) {
  console.log('[page1 layout] fetch start');
  const result = await fetch('http://localhost:3020/test/stackCount');
  console.log('[page1 layout] fetch end');
  const body = await result.json();

  return (
    <>
      <div className="w-full flex flex-wrap gap-2 relative">
        body: { JSON.stringify(body) }
      </div>
      <div className="w-full flex flex-wrap gap-2 relative">
        { props.children }
      </div>
    </>
  );
}
