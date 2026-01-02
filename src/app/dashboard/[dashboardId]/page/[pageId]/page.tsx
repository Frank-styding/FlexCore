"use client";

import { Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageViewer } from "@/features/page/hooks/usePageViewer";
import { DynamicComponent } from "@/features/engine";
import { ComponentEditorModal } from "@/features/editor/components/modals/CreateComponentModal";

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
              <DynamicComponent data={componentStruct} engine={engine} />
            ) : (
              <div className="w-full min-h-full flex justify-center items-center">
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
          </>
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
