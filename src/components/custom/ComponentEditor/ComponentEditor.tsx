"use client";

import { ButtonGroup } from "@/components/ui/button-group";
import { Tap } from "./Tap";
import { TabContainer } from "./TabContainer";
import { ScriptEditor } from "./ScriptEditor";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useConfigMonacoEditor } from "@/hooks/useConfigMonacoEditor";
import {
  addExecutionLogs,
  clearConsole,
  setJsCode,
  setSqlCode,
} from "@/lib/redux/features/ScriptEditorSlice";
import { useCodeDefinitions } from "./useCodeDefinitions";
import { DynamicComponent } from "@/components/DynamicComponents/DynamicComponent";
import { runScript } from "@/lib/runScript/runScript";
import { useScriptActions } from "@/hooks/useScriptActions";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ScriptEditorProps {
  initialSql?: string;
  initialScript?: string;
  onChangeJs?: (value: string) => void;
  onChangeSql?: (value: string) => void;
  onSave?: () => void;
}
const LIB_BASE_URI = "ts:filename/context";
const sanitizeForRedux = (data: any): any => {
  if (typeof data === "function") return "[Function]";
  if (data === null || typeof data !== "object") return data;
  if (Array.isArray(data)) return data.map(sanitizeForRedux);
  const sanitized: any = {};
  for (const key in data) {
    sanitized[key] = sanitizeForRedux(data[key]);
  }
  return sanitized;
};

export const ComponentEditor = ({
  initialSql = "SELECT * FROM items WHERE parent_id = {{parentId}}",
  initialScript = "// Tienes acceso a 'sqlData' y 'variables'\nconst processed = sqlData.map(item => item.name);\nreturn processed;",
  onChangeJs,
  onChangeSql,
  onSave,
}: ScriptEditorProps) => {
  const { jsCode, sqlCode, logs } = useAppSelector(
    (state) => state.scriptEditor
  );
  const dispatch = useAppDispatch();
  const [uiState, setUiState] = useState({
    showEditor: true,
    showPreview: true,
  });
  const [liveComponent, setLiveComponent] = useState<any>(null);
  const { globalDefinitions, sqlDefinitions } = useCodeDefinitions({ sqlCode });
  const { handleEditorDidMount } = useConfigMonacoEditor({
    baseUri: LIB_BASE_URI,
    globalDefinitions: globalDefinitions,
    sqlDefinitions: sqlDefinitions,
  });
  const scriptContext = useScriptActions();

  useEffect(() => {
    dispatch(setJsCode(initialScript));
    dispatch(setSqlCode(initialSql));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Verifica si se presiona Ctrl (Win/Linux) o Meta (Mac) junto con la tecla 's'
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault(); // 🛑 Importante: Bloquea el "Guardar página" del navegador

        if (onSave) {
          console.log("Guardando vía atajo de teclado...");
          onSave();
        }
      }
    };

    // Agregamos el listener a la ventana global
    window.addEventListener("keydown", handleKeyDown);

    // Limpiamos el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSave]); // Se vuelve a crear si la función onSave cambia

  const handleChangeJs = (v) => {
    onChangeJs?.(v);
    dispatch(setJsCode(v || ""));
  };
  const handleChangeSql = (v) => {
    onChangeSql?.(v);
    dispatch(setSqlCode(v || ""));
  };

  const onExecuteScript = async () => {
    try {
      const response = await runScript(jsCode, sqlCode, scriptContext);
      setLiveComponent(response.result);
      const sanitizedResult = sanitizeForRedux(response.result);
      dispatch(
        addExecutionLogs({
          logs: response.logs,
          result: sanitizedResult,
        })
      );
    } catch (error: any) {
      setLiveComponent(null);
      dispatch(
        addExecutionLogs({
          logs: [{ message: "Error crítico:", data: error.message }],
        })
      );
    }
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
        <Button variant="outline" onClick={onSave}>
          <Save className="size-5" />
        </Button>
      </div>
      <div className="w-full h-full flex min-h-0 overflow-hidden gap-4">
        <TabContainer show={uiState.showEditor}>
          <ScriptEditor
            onMount={handleEditorDidMount}
            sqlValue={sqlCode}
            onChangeSql={handleChangeSql}
            jsValue={jsCode}
            onChangeJs={handleChangeJs}
            logs={logs}
            onClean={() => dispatch(clearConsole())}
            onPlay={onExecuteScript}
          />
        </TabContainer>
        <TabContainer show={uiState.showPreview}>
          <DynamicComponent data={liveComponent} />
        </TabContainer>
      </div>
    </div>
  );
};
