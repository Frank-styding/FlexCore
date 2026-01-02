"use client";

import { create } from "zustand";
import { User, Session, AuthChangeEvent } from "@supabase/supabase-js";
import { systemSupabase } from "@/lib/supabase/client";
import { useShallow } from "zustand/react/shallow";

interface UserState {
  user: User | null;
  session: Session | null; // En prod es útil tener el token
  isLoading: boolean;

  // Acciones internas
  setSession: (session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  signOut: () => Promise<void>;
}

const useStore = create<UserState>((set) => ({
  user: null,
  session: null,
  isLoading: true,

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isLoading: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  signOut: async () => {
    // El listener detectará el evento SIGNED_OUT,
    // pero forzamos el estado local por UX inmediata
    set({ user: null, session: null, isLoading: false });
    await systemSupabase.auth.signOut();
  },
}));

// --- Hooks Selectores Optimizados ---
export const useUser = () => useStore((state) => state.user);
export const useSession = () => useStore((state) => state.session);
export const useAuthLoading = () => useStore((state) => state.isLoading);
export const useSignOut = () => useStore((state) => state.signOut);

// Exportamos las acciones para usarlas en el Provider
export const useAuthActions = () =>
  useStore(
    useShallow((state) => ({
      setSession: state.setSession,
      setLoading: state.setLoading,
    }))
  );
