import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// 1. Definimos rutas para fácil mantenimiento
const publicRoutes = ["/login", "/auth", "/api/webhooks", "/view"]; // Rutas accesibles sin login
const authRoutes = ["/login", "/register"]; // Rutas que NO debe ver un usuario logueado

export async function middleware(request: NextRequest) {
  // Inicializamos la respuesta base
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

  // Verificamos al usuario (Seguro pero añade latencia de red)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // --- CASO A: NO HAY USUARIO (No Logueado) ---
  if (!user) {
    // Verificamos si la ruta actual empieza con alguna de las rutas públicas
    const isPublic = publicRoutes.some((route) => path.startsWith(route));

    if (!isPublic) {
      // MEJORA CRÍTICA: Si es una ruta de API, devolvemos 401 JSON, no redirect
      if (path.startsWith("/api")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      // Para el resto de la app, mandamos al login
      url.pathname = "/login";
      // Añadimos la ruta original como query param para redirigir después del login (Opcional pero recomendado)
      // url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }
  }

  // --- CASO B: HAY USUARIO (Logueado) ---
  if (user) {
    // Si intenta entrar a Login o Register
    const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

    // Si intenta entrar a Login, Register O a la raíz "/"
    if (isAuthRoute || path === "/") {
      url.pathname = "/gallery"; // Redirección al Dashboard
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
