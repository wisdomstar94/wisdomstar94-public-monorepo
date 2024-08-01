import { FC } from "react";

export const CacheTestServer: FC = async() => {
  const result = await fetch('http://localhost:3020/test/stackCount', { next: { revalidate: 10 } });
  const body = await result.json();
  console.log('@CacheTestServer.body', body);

  return (
    <div>
      cache test server! { JSON.stringify(body) }
    </div>
  );
};
