"use client";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePublicPageViewer } from "./usePublicPageViewer";
import { DynamicComponent } from "@/features/engine/components/DynamicComponent";

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
    <div className="w-full h-screen bg-background flex flex-col overflow-hidden">
      {componentStruct ? (
        <div className="w-full flex-1 relative overflow-auto">
          <DynamicComponent
            data={componentStruct}
            context={componentStruct.context}
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
