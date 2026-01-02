"use client";

import { Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageViewer } from "@/features/page/hooks/usePageViewer";
import { DynamicComponent } from "@/features/engine";
import { ComponentEditorModal } from "@/features/editor/components/modals/CreateComponentModal";
import { cn } from "@/lib/utils"; // Asumiendo que usas shadcn/ui

export default function Page() {
  const {
    engine,
    componentStruct,
    page,
    handleConfigure,
    handleOnCloseEditor,
    isLoading,
    isEditing,
    handleOnOpenEditor,
    onSave,
  } = usePageViewer();

  return (
    <>
      {/* 1. Agregamos 'min-h' para asegurar que nunca colapse a 0px si está vacío.
         2. Usamos flex-1 si esto está dentro de un layout flex.
      */}
      <div className="w-full h-full min-h-[300px] relative flex flex-col">
        {/* LOADER: Renderizado condicionalmente como OVERLAY (encima de todo) */}
        {isLoading && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Procesando cambios...
            </p>
          </div>
        )}

        {!isEditing && (
          <div
            className={cn(
              "flex-1 w-full h-full transition-opacity duration-200",
              isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
            )}
          >
            {componentStruct ? (
              <DynamicComponent data={componentStruct} engine={engine} />
            ) : (
              // Estado vacío / Configuración
              <div className="w-full h-full min-h-[50vh] flex justify-center items-center">
                <Button
                  onClick={handleConfigure}
                  variant="outline"
                  className="w-40 h-40 flex flex-col gap-2 text-lg"
                >
                  <Settings className="size-8 mb-2" />
                  Configurar Página
                  <span className="text-xs text-muted-foreground font-normal">
                    {page?.name || "Sin título"}
                  </span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <ComponentEditorModal
        id={"213123123_editor_modal"}
        onClose={handleOnCloseEditor}
        onOpen={handleOnOpenEditor}
        onSave={onSave}
      />
    </>
  );
}
