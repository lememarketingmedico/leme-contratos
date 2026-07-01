import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createSessionToken, SESSION_COOKIE, verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');

  const user = await prisma.user.findUnique({ where: { email } });
  const isValid = user ? await verifyPassword(password, user.passwordHash) : false;

  if (!user || !isValid) {
    return NextResponse.redirect(new URL('/login?erro=1', request.url), { status: 303 });
  }

  const token = createSessionToken({ userId: user.id, email: user.email });
  const response = NextResponse.redirect(new URL('/dashboard', request.url), { status: 303 });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
