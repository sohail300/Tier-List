import { NextResponse } from "next/server";
import { auth } from "@/auth";

const protectedPrefixes = [
  "/dashboard",
  "/tier-lists",
  "/api/tier-lists",
  "/api/upload",
];

function isProtectedRoute(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export default auth((request) => {
  if (!isProtectedRoute(request.nextUrl.pathname) || request.auth) {
    return;
  }

  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/", request.nextUrl.origin));
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpg|jpeg|png|gif|svg|ttf|woff2?|ico|json)).*)",
    "/(api|trpc)(.*)",
  ],
};
