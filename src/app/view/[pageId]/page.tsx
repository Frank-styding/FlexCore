// app/view/[pageId]/page.tsx
"use client";

import { DynamicComponent } from "@/components/DynamicComponents/DynamicComponent";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePublicPageViewer } from "./usePublicPageViewer";

export default function PublicPageView() {
  const { componentStruct, isLoading, isAccessDenied } = usePublicPageViewer();

  if (isAccessDenied) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    // CAMBIO 1: Usamos 'h-screen' (altura fija de ventana) en lugar de min-h-screen
    // CAMBIO 2: Agregamos 'flex flex-col' para controlar el layout de los hijos
    <div className="w-full h-screen bg-background flex flex-col overflow-hidden">
      {componentStruct ? (
        // CAMBIO 3: Envolvemos el componente en un div con 'flex-1'
        // Esto fuerza al div a ocupar todo el espacio vertical sobrante
        <div className="w-full flex-1 relative overflow-auto">
          <DynamicComponent
            data={componentStruct}
            context={componentStruct.context}
            // Opcional: Si DynamicComponent soporta className, pásale h-full también
            // className="w-full h-full"
          />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          La página no generó contenido.
        </div>
      )}
    </div>
  );
}
