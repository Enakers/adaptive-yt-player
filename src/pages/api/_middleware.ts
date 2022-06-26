import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  if (req.nextUrl.pathname.includes('auth')) return NextResponse.next();

  if (!token) {
    return new Response(JSON.stringify({ message: 'Unauthorised' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  return NextResponse.next();
}
