import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/edge";
import { ADMIN_ROUTES, STUDENT_ROUTES, PUBLIC_ROUTES } from "@/lib/constants/routes";

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).auth;

  const isPublic = PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "?")
  );
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r)) && !isPublic;
  const isStudentRoute = STUDENT_ROUTES.some((r) =>
    pathname.startsWith(r)
  ) && !isPublic;

  // If not authenticated and trying to access protected route → redirect to /login
  if (!session && (isAdminRoute || isStudentRoute)) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated but wrong role
  if (session) {
    const role = session.user?.role;

    // Student trying to access admin routes → redirect to student dashboard
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(
        new URL("/dashboard", req.nextUrl.origin)
      );
    }

    // If authenticated and trying to access public login pages → redirect to appropriate dashboard
    const isLoginPage =
      pathname === "/login" || pathname === "/admin/login";
    if (isPublic && isLoginPage) {
      if (role === "admin") {
        return NextResponse.redirect(
          new URL("/admin/dashboard", req.nextUrl.origin)
        );
      }
      if (role === "student") {
        return NextResponse.redirect(
          new URL("/dashboard", req.nextUrl.origin)
        );
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js).*)",
  ],
};
