"use client";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted shadow-sm animate-in zoom-in duration-300">
        <FileQuestion className="h-10 w-10 text-primary" />
      </div>

      <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl">
        404
      </h1>

      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
        Página no encontrada
      </h2>

      <p className="mt-2 max-w-md text-muted-foreground">
        Lo sentimos, no pudimos encontrar la página que estás buscando. Verifica
        la URL o regresa al inicio.
      </p>

      <p className="mt-12 text-sm text-muted-foreground">
        Código de error: 404
      </p>
    </div>
  );
}
