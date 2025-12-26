"use client";

import { useModals } from "@/components/providers/ModalProvider";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ComponentEditorModal } from "../../../components/custom/Modals/CreateComponentModal";
import { usePageEditor } from "@/hooks/usePageEditor";
import { useScriptActions } from "@/hooks/useScriptActions";
import { useEffect, useId, useState } from "react";
import { runScript } from "@/lib/runScript/runScript";
import { DynamicComponent } from "@/components/DynamicComponents/DynamicComponent";
import { Component } from "@/lib/ComponentBuilders/Component";
import { useScriptEditor } from "@/hooks/useScriptEditor";

export default function Page() {
  const createModalId = useId();

  const { openModal } = useModals();
  const { sqlCode, jsCode } = usePageEditor();
  const scriptContext = useScriptActions();
  const [componentStruct, setComponentStruct] = useState<Component | null>(
    null
  );
  const { isEditingBy, setIsEditingBy } = useScriptEditor();

  const onClick = () => {
    setIsEditingBy("page");

    openModal(createModalId);
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

  const onClose = () => {
    setIsEditingBy();
  };

  return (
    <>
      {isEditingBy != "page" && (
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
            </>
          )}
        </>
      )}
      <ComponentEditorModal id={createModalId} onClose={onClose} />
    </>
  );
}
