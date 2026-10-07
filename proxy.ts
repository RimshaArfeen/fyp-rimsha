
//proxy.ts
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
 const role = (req.auth?.user as any)?.role;
  const path = nextUrl.pathname;

  const isAuthPage = path === "/login" || path === "/signup";
  const home = role === "teacher" ? "/teacher/dashboard" : "/dashboard";

  // Logged-in users shouldn't see login/signup
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL(home, nextUrl));
  }

  // Logged-out users can't access protected pages
  if (!isAuthPage && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/teacher/:path*",
    "/profile/:path*",
    "/login",
    "/signup",
  ],
};