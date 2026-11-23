import { NextResponse } from 'next/server';
import { TEAM_COOKIE, teamToken } from '../../../lib/auth';

export const runtime = 'nodejs';

export async function POST(request) {
  const form = await request.formData();
  const password = String(form.get('password') || '');
  const token = teamToken();
  const url = new URL('/team', request.url);

  if (!token || password !== process.env.TEAM_PASSWORD) {
    url.searchParams.set('error', '1');
    return NextResponse.redirect(url, 303);
  }
  const res = NextResponse.redirect(url, 303);
  res.cookies.set(TEAM_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
