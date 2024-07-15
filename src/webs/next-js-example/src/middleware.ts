import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  // console.log('@middleware 호출됨..!');
  // console.log('@request.method', request.method);
  // console.log('@request.url', request.url);
  // try {
  //   console.log('@request.body', await request.json());
  // } catch (e) {
  //   console.error('@request.body.error', e);
  // }
  // console.log('@request.ip', request.ip);
  // console.log('@request.headers', request.headers);
  // console.log('@request.cookies', request.cookies);

  // request header control
  const requestHeaders = new Headers(request.headers);

  // Add new request headers
  requestHeaders.set('x-hello-from-middleware1', 'hello');
  requestHeaders.set('x-hello-from-middleware2', 'world!');

  // Update an existing request header
  requestHeaders.set('user-agent', 'New User Agent overriden by middleware!');

  // Delete an existing request header
  requestHeaders.delete('x-from-client');

  return NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });
}
