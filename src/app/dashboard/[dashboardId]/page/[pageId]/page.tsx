"use client";

import { ComponentEditorModal } from "@/components/custom/Modals/CreateComponentModal";
import { DynamicComponent } from "@/components/DynamicComponents/DynamicComponent";
import { Loader2, Settings } from "lucide-react";
import { usePageViewer } from "./usePageViewer";
import { Button } from "@/components/ui/button";

export default function Page() {
  const {
    componentStruct,
    activePage,
    handleConfigure,
    handleOnCloseEditor,
    isLoading,
    isEditing,
    handleOnOpenEditor, // Asumo que lo usas en el modal si es necesario
    onSave,
    isSaving,
  } = usePageViewer();

  return (
    <>
      <div className="w-full h-full relative">
        {isLoading ? (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm animate-in fade-in">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Procesando cambios...
            </p>
          </div>
        ) : null}
        {!isEditing && !isLoading && (
          <>
            {componentStruct ? (
              <DynamicComponent
                data={componentStruct}
                context={componentStruct.context}
              />
            ) : (
              /* Estado Vacío */
              <div className="w-full min-h-full flex justify-center items-center">
                <Button
                  onClick={handleConfigure}
                  variant="outline"
                  className="w-40 h-40 flex flex-col gap-2 text-lg"
                >
                  <Settings className="size-8 mb-2" />
                  Configurar Página
                  <span className="text-xs text-muted-foreground font-normal">
                    {activePage?.name || "Sin título"}
                  </span>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <ComponentEditorModal
        id={"213123123_editor_modal"}
        onClose={handleOnCloseEditor}
        onOpen={handleOnOpenEditor}
        onSave={onSave}
        isSaving={isSaving}
      />
    </>
  );
}
