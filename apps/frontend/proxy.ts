import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { tokenCookieName } from "./app/lib/auth-session";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api";

async function isValidSession(token: string) {
  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

function redirectToLogin(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(tokenCookieName);

  return response;
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(tokenCookieName)?.value;
  const isLogin = request.nextUrl.pathname === "/login";

  if (!token) {
    return isLogin ? NextResponse.next() : redirectToLogin(request);
  }

  const hasValidSession = await isValidSession(token);

  if (!hasValidSession) {
    return isLogin ? NextResponse.next() : redirectToLogin(request);
  }

  if (isLogin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};
