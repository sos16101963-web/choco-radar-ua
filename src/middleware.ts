import { NextRequest, NextResponse } from 'next/server';

const CANONICAL_ORIGIN = 'https://www.crafohab.com.ua';

export function middleware(request: NextRequest) {
  const rawHost = request.headers.get('host') || '';
  const host = rawHost.split(':')[0].toLowerCase();

  if (host === 'choco-radar-ua.vercel.app') {
    const target = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      CANONICAL_ORIGIN
    );
    const response = NextResponse.redirect(target, 308);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  if (host.endsWith('.vercel.app')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
