// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

// Esta instancia es UNICA y se reutiliza.
// Se conecta a las variables de entorno de TU proyecto.
export const systemSupabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
