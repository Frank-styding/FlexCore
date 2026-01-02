import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const AuthHeader = ({ isSignUp }: { isSignUp: boolean }) => (
  <CardHeader className="space-y-1">
    <CardTitle className="text-2xl font-bold text-center">
      {isSignUp ? "Crear cuenta" : "Bienvenido de nuevo"}
    </CardTitle>
    <CardDescription className="text-center">
      {isSignUp
        ? "Ingresa tus datos para registrarte en la plataforma"
        : "Ingresa tu email y contraseña para acceder"}
    </CardDescription>
  </CardHeader>
);
