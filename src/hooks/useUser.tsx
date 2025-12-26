"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { User } from "@supabase/supabase-js";
import { systemSupabase } from "@/lib/supabase/client";

// Definimos qué información tendrá nuestro contexto
interface UserContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Verificar sesión inicial
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await systemSupabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error cargando usuario:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // 2. Escuchar cambios en tiempo real (Login, Logout, Auto-refresh)
    const {
      data: { subscription },
    } = systemSupabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await systemSupabase.auth.signOut();
    setUser(null);
    // Opcional: Redirigir o limpiar estado aquí
  };

  const value = {
    user,
    isLoading,
    signOut,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Este es el hook que usarás en tus componentes
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};
