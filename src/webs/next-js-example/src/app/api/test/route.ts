import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const url = request.url;
  const body = await (async function() {
    try {
      await request.json();
    } catch(e: any) {
      console.log('@request.json.error.name', e.name);
      return undefined;
    }
  })();
  const cookie = cookies(); 

  const urlObj = new URL(url);
  const page = urlObj.searchParams.get("page");
  const size = urlObj.searchParams.get("size");
  const queryString = urlObj.searchParams.entries();

  console.log('/api/test 호출됨..!', params);
  console.log('@url', url);
  console.log('@body', body);
  console.log('@cookie.getAll', cookie.getAll());
  console.log('@queryString', queryString);
  console.log('@queryString.page', page);
  console.log('@queryString.size', size);

  return NextResponse.json({
    timestamp: Date.now(),
  });
}
