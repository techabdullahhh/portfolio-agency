import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = ["/admin", "/api/projects", "/api/services", "/api/testimonials", "/api/blog", "/api/team", "/api/messages", "/api/settings", "/api/media"];

export default withAuth(
  function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === "/" || pathname.startsWith("/api/public")) {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
        if (!isProtected) {
          return true;
        }
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};

