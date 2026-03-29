import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const privyToken = req.cookies.get("privy-token");

  if (!privyToken && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
