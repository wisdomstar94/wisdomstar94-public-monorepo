import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  console.log('@middleware 호출됨..!');
  console.log('@request.method', request.method);
  console.log('@request.url', request.url);
  try {
    console.log('@request.body', await request.json());
  } catch (e) {
    console.error('@request.body.error', e);
  }
  console.log('@request.ip', request.ip);
  console.log('@request.headers', request.headers);
  console.log('@request.cookies', request.cookies);

  const response = new NextResponse();
  response.headers.set('x-your-custom-header', '...');
  return response;
}
