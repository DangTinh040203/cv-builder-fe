import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";

import { Env } from "@/configs/env.config";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = Env.AUTH_SECRET;
  const token: JWT | null = await getToken({ req, secret });

  // Allow the requests
  const allowedUnauthenticatedPaths = ["/sign-in", "/sign-up", "/verify-email"];
  const isAllowedUnauthenticatedPath = allowedUnauthenticatedPaths.some(
    (path) => pathname.startsWith(path),
  );
  if (isAllowedUnauthenticatedPath) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    } else {
      return NextResponse.next();
    }
  }

  if (!token) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)", "/"],
};
