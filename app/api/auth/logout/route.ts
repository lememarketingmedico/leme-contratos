import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '../../../../lib/auth';
import { publicUrl } from '../../../../lib/url';

export async function POST(request: Request) {
  const response = NextResponse.redirect(publicUrl('/login', request), { status: 303 });
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
  return response;
}
