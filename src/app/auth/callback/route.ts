import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  // El flujo PKCE devuelve un 'code'
  const code = searchParams.get("code");

  // "next" es a donde redirigir después (por defecto /gallery)
  const next = searchParams.get("next") ?? "/gallery";

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // El método setAll fue llamado desde un Server Component.
              // Esto puede ignorarse si tienes middleware refrescando sesiones.
            }
          },
        },
      }
    );

    // Intercambiamos el código por la sesión del usuario
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Login exitoso: redirigir a la app
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Si no hay código o hubo error, mandar a error
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
