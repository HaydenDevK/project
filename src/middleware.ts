import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  if (!token) {
    const redirectUrl = new URL('/signin', req.url);

    if (pathname.startsWith('/trip')) {
      redirectUrl.searchParams.set('redirectTo', req.nextUrl.toString());
    }

    if (pathname === '/signin' || pathname === '/signup') {
      return NextResponse.next();
    }

    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === '/signin' || pathname === '/signup') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|favicon.ico).*)'],
};
