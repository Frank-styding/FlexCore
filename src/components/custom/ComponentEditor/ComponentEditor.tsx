"use client";
import { ButtonGroup } from "@/components/ui/button-group";
import { Tap } from "./Tap";
import { ScriptEditor } from "./ScriptEditor";
import { useEffect, useRef, useState } from "react";
import { useCodeDefinitions } from "../../../hooks/useCodeDefinitions";
import { DynamicComponent } from "@/components/DynamicComponents/DynamicComponent";
import { runScript } from "@/lib/runScript/runScript";
import { useScriptActions } from "@/hooks/useScriptActions";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { TabContainer } from "./TabContainer";
import { useScriptEditor } from "@/hooks/useScriptEditor";

interface ScriptEditorProps {
  initialSql?: string;
  initialScript?: string;
  onChangeJs?: (value: string) => void;
  onChangeSql?: (value: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export const ComponentEditor = ({
  onChangeJs,
  onChangeSql,
  onSave,
  isSaving,
}: ScriptEditorProps) => {
  const {
    jsCode,
    sqlCode,
    logs,
    addExecutionLogs,
    setJsCode,
    setSqlCode,
    clearConsole,
  } = useScriptEditor();

  const [uiState, setUiState] = useState({
    showEditor: true,
    showPreview: true,
  });

  const [liveComponent, setLiveComponent] = useState<any>(null);
  const hasRunInitialScript = useRef(false);
  const [renderKey, setRenderKey] = useState(0);
  const scriptContext = useScriptActions();
  const { definitions } = useCodeDefinitions({ sqlCode });

  const onExecuteScript = async () => {
    try {
      const response = await runScript(jsCode, sqlCode, scriptContext);

      setLiveComponent(response.result);
      /*       const sanitizedResult = sanitizeForRedux(response.result); */
      addExecutionLogs(response.logs);
      setRenderKey((prev) => prev + 1);
    } catch (error: any) {
      setLiveComponent(null);
      addExecutionLogs([{ message: "Error crítico:", data: error.message }]);
    }
  };

  const handleChangeJs = (v) => {
    onChangeJs?.(v);
    setJsCode(v || "");
  };
  const handleChangeSql = (v) => {
    onChangeSql?.(v);
    setSqlCode(v || "");
  };
  // 3. NUEVO EFFECT: Ejecutar al montar (o cuando llegue el código)
  useEffect(() => {
    // Si ya corrió la primera vez, no hacemos nada (evita loop infinito al escribir)
    if (hasRunInitialScript.current) return;

    // "Siempre y cuando la pagina este cargada":
    // Verificamos si hay código JS para ejecutar.
    if (jsCode && jsCode.trim() !== "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      onExecuteScript();
      hasRunInitialScript.current = true; // Marcamos como ejecutado
    }
  }, [jsCode]);

  const handleOnSave = () => {
    onExecuteScript();
    onSave?.();
  };

  const onTab = (name: string) => {
    if (name == "Script") {
      if (uiState.showEditor && !uiState.showPreview) {
        setUiState({
          ...uiState,
          showEditor: !uiState.showEditor,
          showPreview: true,
        });
        return;
      }
      setUiState({ ...uiState, showEditor: !uiState.showEditor });
      return;
    }
    if (name == "Preview") {
      if (!uiState.showEditor && uiState.showPreview) {
        setUiState({
          ...uiState,
          showPreview: !uiState.showPreview,
          showEditor: true,
        });
        return;
      }
      setUiState({ ...uiState, showPreview: !uiState.showPreview });
      return;
    }
  };

  return (
    <div className="w-full h-full grid grid-rows-[45px_1fr]">
      <div className="w-full h-12 flex gap-3">
        <ButtonGroup>
          <Tap
            name="Script"
            onClick={() => onTab("Script")}
            active={uiState.showEditor}
          />
          <Tap
            name="Preview"
            onClick={() => onTab("Preview")}
            active={uiState.showPreview}
          />
        </ButtonGroup>
        <Button variant="outline" onClick={handleOnSave}>
          {isSaving ? (
            // Spinner
            <Loader2 className="size-5 animate-spin" />
          ) : (
            // Icono Normal
            <Save className="size-5" />
          )}
        </Button>
      </div>
      <div className="w-full h-full flex min-h-0 overflow-hidden gap-4">
        <TabContainer show={uiState.showEditor}>
          <ScriptEditor
            sqlValue={sqlCode}
            onChangeSql={handleChangeSql}
            jsValue={jsCode}
            onChangeJs={handleChangeJs}
            logs={logs}
            onClean={clearConsole}
            onPlay={onExecuteScript}
            onSave={handleOnSave}
            definitions={definitions}
          />
        </TabContainer>
        <TabContainer show={uiState.showPreview}>
          <DynamicComponent
            key={renderKey}
            data={liveComponent}
            context={liveComponent?.context}
          />
        </TabContainer>
      </div>
    </div>
  );
};
