import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken, type JWT } from "next-auth/jwt";

import { Env } from "@/configs/env.config";
import { Route } from "@/constants/route.constant";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = Env.AUTH_SECRET;
  const token: JWT | null = await getToken({ req, secret });

  const allowedUnauthenticatedPaths = [
    Route.Home,
    Route.SignIn,
    Route.SignUp,
    Route.VerifyOtp,
  ];

  const isAllowedUnauthenticatedPath =
    allowedUnauthenticatedPaths.includes(pathname as Route) ||
    allowedUnauthenticatedPaths
      .filter((p) => p !== Route.Home)
      .some((p) => pathname.startsWith(p));

  if (isAllowedUnauthenticatedPath) {
    if (token && pathname !== Route.Home.toString()) {
      return NextResponse.redirect(new URL(Route.Home, req.url));
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
