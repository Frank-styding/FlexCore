import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./lib/supabase/server";

const publicRoutes = ["/login", "/auth", "/api/webhooks", "/view"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  if (!user) {
    const isPublic = publicRoutes.some((route) => path.startsWith(route));

    if (!isPublic) {
      if (path.startsWith("/api")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      url.pathname = "/login";

      return NextResponse.redirect(url);
    }
  }

  if (user) {
    const isAuthRoute = authRoutes.some((route) => path.startsWith(route));
    if (isAuthRoute || path === "/") {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
