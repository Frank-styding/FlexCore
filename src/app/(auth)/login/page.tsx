"use client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  AuthButtons,
  AuthHeader,
  LoginForm,
  useAuthForm,
} from "@/features/auth";

export default function LoginPage() {
  const state = useAuthForm();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md shadow-lg">
        <AuthHeader isSignUp={state.isSignUp} />
        <CardContent className="space-y-4">
          <LoginForm {...state} />
        </CardContent>
        <CardFooter className="justify-center">
          <AuthButtons
            isSignUp={state.isSignUp}
            setIsSignUp={state.setIsSignUp}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
