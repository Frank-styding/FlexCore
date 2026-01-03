"use client";
import { ButtonGroup } from "@/components/ui/button-group";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCodeDefinitions } from "../../hooks/useCodeDefinitions";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { DynamicComponent, useEditor, useEngine } from "@/features/engine";
import { Tap } from "./Tap";
import { TabContainer } from "./TabContainer";
import { IEngine } from "@/features/engine/modules";
import dynamic from "next/dynamic";
const ScriptEditor = dynamic(
  () => import("../editor/ScriptEditor").then((mod) => mod.ScriptEditor),
  {
    ssr: false,
    loading: () => <p>Cargando editor...</p>,
  }
);

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
    sqlCode,
    addExecutionLogs,
    setJsCode,
    setSqlCode,
    jsCode,
    clearConsole,
    logs,
  } = useEditor();

  const { createEngine, runScript } = useEngine();

  const [uiState, setUiState] = useState({
    showEditor: true,
    showPreview: true,
  });

  const [liveComponent, setLiveComponent] = useState<any>(null);
  const hasRunInitialScript = useRef(false);
  const [engine, setEngine] = useState<IEngine | null>(null);

  // Generamos definiciones para Monaco
  const { definitions } = useCodeDefinitions({ sqlCode, engine });

  // 1. Inicialización del Engine (Solo una vez al montar)
  useEffect(() => {
    const _engine = createEngine();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEngine(_engine);
  }, [createEngine]);

  // 2. Función de ejecución (Memorizada para evitar recreación)
  const onExecuteScript = useCallback(async () => {
    // Si no hay engine, no podemos hacer nada
    if (!engine) return;

    try {
      const response = await runScript(jsCode, sqlCode, engine);
      setLiveComponent(response.result);
    } catch (error: any) {
      setLiveComponent(null);
      addExecutionLogs([{ message: "Error crítico:", data: error.message }]);
    }
  }, [engine, jsCode, sqlCode, runScript, addExecutionLogs]);

  // 3. Ejecución inicial automática (CORREGIDO)
  useEffect(() => {
    if (engine && jsCode && !hasRunInitialScript.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      onExecuteScript();
      hasRunInitialScript.current = true;
    }
  }, [engine, jsCode, onExecuteScript]);

  // Handlers optimizados
  const handleChangeJs = useCallback(
    (v: string | undefined) => {
      const val = v || "";
      onChangeJs?.(val);
      setJsCode(val);
    },
    [onChangeJs, setJsCode]
  );

  const handleChangeSql = useCallback(
    (v: string | undefined) => {
      const val = v || "";
      onChangeSql?.(val);
      setSqlCode(val);
    },
    [onChangeSql, setSqlCode]
  );

  const handleOnSave = useCallback(() => {
    onExecuteScript();
    onSave?.();
  }, [onExecuteScript, onSave]);

  const onTab = (name: string) => {
    setUiState((prev) => {
      if (name === "Script") {
        // Toggle inteligente: Si solo hay preview, al hacer click en Script, mostramos ambos o switch
        if (!prev.showEditor && prev.showPreview) {
          return { ...prev, showEditor: true };
        }
        return { ...prev, showEditor: !prev.showEditor };
      }
      if (name === "Preview") {
        if (prev.showEditor && !prev.showPreview) {
          return { ...prev, showPreview: true };
        }
        return { ...prev, showPreview: !prev.showPreview };
      }
      return prev;
    });
  };

  return (
    // CAMBIO IMPORTANTE: h-full y min-h-0 para evitar desbordes
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header fijo */}
      <div className="flex-none h-12 flex gap-3 mb-2">
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
        <Button variant="outline" onClick={handleOnSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Save className="size-5" />
          )}
        </Button>
      </div>

      {/* Contenedor de paneles: flex-1 ocupa el resto, min-h-0 habilita el scroll interno */}
      <div className="flex-1 w-full flex min-h-0 overflow-hidden gap-4">
        <TabContainer show={uiState.showEditor}>
          {engine && definitions.length > 0 && (
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
          )}
        </TabContainer>

        <TabContainer show={uiState.showPreview}>
          <div className="h-full w-full overflow-auto bg-background/50 rounded-md border border-border">
            <DynamicComponent data={liveComponent} engine={engine} />
          </div>
        </TabContainer>
      </div>
    </div>
  );
};
