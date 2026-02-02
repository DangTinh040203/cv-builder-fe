import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";

const isAuthRoute = createRouteMatcher(["/auth(.*)"]);
const isProtectedRoute = createRouteMatcher(["/builder(.*)"]);

const handler = clerkMiddleware(async (auth, req) => {
  const { isAuthenticated } = await auth();

  if (isAuthenticated && isAuthRoute(req)) {
    return NextResponse.redirect(new URL("/not-found", req.url));
  }

  if (!isAuthenticated && isProtectedRoute(req)) {
    const signInUrl = new URL("/auth/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export function proxy(req: NextRequest, event: NextFetchEvent) {
  return handler(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
