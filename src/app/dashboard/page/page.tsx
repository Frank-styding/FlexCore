"use client";

import { useModals } from "@/components/providers/ModalProvider";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ComponentEditorModal } from "../../../components/custom/CreateComponentModal";
import { usePageEditor } from "@/hooks/usePageEditor";
import { useScriptActions } from "@/hooks/useScriptActions";
import { useEffect, useState } from "react";
import { runScript } from "@/lib/runScript/runScript";
import { DynamicComponent } from "@/components/DynamicComponents/DynamicComponent";
import { Component } from "@/lib/ComponentBuilders/Component";

export default function Page() {
  const { openModal } = useModals();
  const { sqlCode, jsCode } = usePageEditor();
  const scriptContext = useScriptActions();
  const [componentStruct, setComponentStruct] = useState<Component | null>(
    null
  );

  const onClick = () => {
    openModal("create-component-1");
  };

  useEffect(() => {
    if (!jsCode || jsCode.trim() === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setComponentStruct(null);
      return;
    }
    runScript(jsCode, sqlCode, scriptContext)
      .then(({ result }) => {
        setComponentStruct(result);
      })
      .catch((err) => {
        console.error("Error ejecutando script de página:", err);
        // Opcional: setComponentStruct(null) si falla
      });
  }, [jsCode]);

  return (
    <>
      {componentStruct ? (
        <DynamicComponent
          data={componentStruct}
          context={componentStruct.context}
        />
      ) : (
        <>
          <div className="w-full min-h-full flex justify-center items-center">
            <Button
              onClick={onClick}
              variant="outline"
              className="w-40 h-40 flex items-center gap-2 justify-center flex-col text-lg"
            >
              <Settings className="size-5" />
              Configure Page
            </Button>
          </div>
          <ComponentEditorModal id="create-component-1" />
        </>
      )}
    </>
  );
}
