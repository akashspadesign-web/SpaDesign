import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

/**
 * Gate the admin area. The public site, the public lead-create POST, and the
 * login routes themselves stay open. Everything else under /admin or
 * /api/admin requires a valid session cookie; GET/PATCH /api/leads also
 * requires one (POST stays public for the form).
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  const authed = !!session;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (authed) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/leads";
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Lead admin APIs: GET list, PATCH status — admin only.
  if (pathname.startsWith("/api/leads")) {
    if (req.method === "POST" && pathname === "/api/leads") {
      return NextResponse.next();
    }
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Projects API: reads (GET) are public; writes (POST/PATCH/DELETE) admin-only.
  if (pathname.startsWith("/api/projects")) {
    if (req.method === "GET") return NextResponse.next();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Image upload (admin-only) — writes files to public/projects/.
  if (pathname.startsWith("/api/upload")) {
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Site settings (admin-only) — key/value config like the founder photo URL.
  if (pathname.startsWith("/api/admin/site-settings")) {
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/leads/:path*",
    "/api/projects/:path*",
    "/api/upload/:path*",
    "/api/admin/site-settings/:path*",
  ],
};
