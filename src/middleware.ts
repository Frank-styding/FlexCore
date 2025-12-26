import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value, ...options });
          });
        },
      },
    }
  );

  // Verificamos al usuario
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  // --- CASO A: NO HAY USUARIO (No Logueado) ---
  if (!user) {
    // Si NO está en login, NO en register y NO en rutas de auth (callbacks)
    if (
      !url.pathname.startsWith("/login") &&
      !url.pathname.startsWith("/register") &&
      !url.pathname.startsWith("/auth") // <--- IMPORTANTE: Permitir verificar email
    ) {
      // Antes tenías "/", lo cambiamos a "/login"
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // --- CASO B: HAY USUARIO (Logueado) ---
  if (user) {
    // Si intenta entrar a Login, Register O a la raíz "/"
    if (
      url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/register") ||
      url.pathname === "/" // <--- Si entra a la home, lo mandamos a la app
    ) {
      url.pathname = "/gallery"; // O "/dashboard", según tu preferencia
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (icono del navegador)
     * - Extensiones de archivos públicos (svg, png, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
