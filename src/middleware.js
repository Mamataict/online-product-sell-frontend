import { NextResponse } from "next/server";

const protectedRoutes = ["/dairy_fresh/home"];
const publicRoutes = ["/dairy_fresh/login"];

export function middleware(request) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
    const loginUrl = new URL("/dairy_fresh/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dairy_fresh/home/:path*"],
};
