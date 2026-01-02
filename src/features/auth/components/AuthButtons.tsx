import { Button } from "@/components/ui/button";

export const AuthButtons = ({
  isSignUp,
  setIsSignUp,
}: {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
}) => (
  <Button
    variant="link"
    className="text-sm text-muted-foreground"
    onClick={() => setIsSignUp(!isSignUp)}
  >
    {isSignUp
      ? "¿Ya tienes cuenta? Inicia sesión"
      : "¿No tienes cuenta? Regístrate"}
  </Button>
);
