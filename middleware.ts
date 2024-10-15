import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';

export async function middleware(req: NextRequest) {
  const session = await auth();
  console.log('middleware call auth')
  const didLogin = !!session?.user;

  const signinPath = '/api/auth/signin';

  if (didLogin && req.nextUrl.pathname === signinPath) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (!didLogin && req.nextUrl.pathname !== signinPath) {
    const callbackUrl = encodeURIComponent(req.nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/api/auth/signin?callbackUrl=${callbackUrl}`, req.url)
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth/).*)', '/api/auth/signin'],
};
