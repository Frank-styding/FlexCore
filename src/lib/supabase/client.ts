import { createBrowserClient } from "@supabase/ssr";

// NO uses createClient de '@supabase/supabase-js' directamente si usas Next.js App Router
export const systemSupabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
