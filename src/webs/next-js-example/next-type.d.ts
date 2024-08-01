// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
type NextRouteSegmentConfigDynamic = 'auto' | 'force-dynamic' | 'error' | 'force-static';

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamicparams
type NextRouteSegmentConfigDynamicParams = boolean;

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate
type NextRouteSegmentConfigRevalidate = false | 0 | number;

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#fetchcache
type NextRouteSegmentConfigFetchCache = 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store';

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#runtime
type NextRouteSegmentConfigRuntime = 'nodejs' | 'edge';

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#preferredregion
type NextRouteSegmentConfigPreferredRegion = 'auto' | 'global' | 'home' | string | string[];

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#maxduration
type NextRouteSegmentConfigMaxDuration = number;

type NextLayoutDefaultProps = {
  children: React.ReactNode;
}