"use client";

import { useEffect } from "react";
import { systemSupabase } from "@/lib/supabase/client";
import { useAuthActions } from "@/hooks/useUser"; // Ajusta la ruta

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setSession, setLoading } = useAuthActions();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await systemSupabase.auth.getSession();
        setSession(session);
      } catch (error) {
        console.error("Error checking auth:", error);
        setSession(null);
      }
    };

    initializeAuth();
    const {
      data: { subscription },
    } = systemSupabase.auth.onAuthStateChange(async (_event, session) => {
      // Opcional: Manejar eventos específicos como 'PASSWORD_RECOVERY'

      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setLoading]);

  return <>{children}</>;
}
