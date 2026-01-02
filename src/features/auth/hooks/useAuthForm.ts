"use client";

import { systemSupabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const useAuthForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  /*   const checkSession = useCheckSession();
   */
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await systemSupabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;
        toast.success("¡Cuenta creada con éxito!", {
          description: "Por favor, revisa tu email para confirmar tu cuenta.",
          duration: 5000,
        });
      } else {
        const { error } = await systemSupabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("¡Bienvenido de nuevo!", {
          description: "Iniciando sesión...",
        });
        router.refresh();
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error("Ocurrió un error", {
        description: err.message || "No se pudo completar la solicitud.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSignUp,
    setIsSignUp,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    onSubmit: handleAuth,
  };
};
