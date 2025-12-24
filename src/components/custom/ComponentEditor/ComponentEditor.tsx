"use client";

import { ButtonGroup } from "@/components/ui/button-group";
import { Tap } from "./Tap";
import { TabContainer } from "./TabContainer";
import { ScriptEditor } from "./CustomEditor";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useConfigMonacoEditor } from "@/hooks/useConfigMonacoEditor";
import {
  clearConsole,
  executeScript,
  setJsCode,
  setSqlCode,
} from "@/lib/redux/features/ScriptEditorSlice";
import { ComponentstypeDefinition } from "@/lib/ComponentBuilders/Builders";
import { useCodeDefinitions } from "./useCodeDefinitions";
import { DynamicComponent } from "@/components/DynamicComponents/DynamicComponent";

interface ScriptEditorProps {
  initialSql?: string;
  initialScript?: string;
  onChangeJs?: (value: string) => void;
  onChangeSql?: (value: string) => void;
}
const LIB_BASE_URI = "ts:filename/context";

export const ComponentEditor = ({
  initialSql = "SELECT * FROM items WHERE parent_id = {{parentId}}",
  initialScript = "// Tienes acceso a 'sqlData' y 'variables'\nconst processed = sqlData.map(item => item.name);\nreturn processed;",
  onChangeJs,
  onChangeSql,
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

  useEffect(() => {
    dispatch(setJsCode(initialScript));
    dispatch(setSqlCode(initialSql));
  }, []);

  const { globalDefinitions, sqlDefinitions } = useCodeDefinitions({
    sqlCode,
    initDefinitions: ComponentstypeDefinition,
  });

  const { handleEditorDidMount } = useConfigMonacoEditor({
    baseUri: LIB_BASE_URI,
    globalDefinitions: globalDefinitions,
    sqlDefinitions: sqlDefinitions,
  });

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
      // 1. Usamos .unwrap() para obtener el resultado limpio del Thunk
      // Esto ignora la estructura de la acción de Redux y te da el return directo.
      const result = await dispatch(executeScript()).unwrap();

      console.log("Script Result:", result); // Para depurar
      setLiveComponent(result.result);

      // Opcional: Cambiar a la pestaña de vista previa automáticamente si hay éxito
      // setUiState(prev => ({ ...prev, showPreview: true }));
    } catch (error) {
      console.error("Script failed:", error);
      // Si falla, podrías querer limpiar el componente o mostrar un estado de error
      setLiveComponent(null);
    }
  };

  const onTab = (name: string) => {
    if (name == "Script") {
      if (uiState.showEditor && !uiState.showPreview) return;
      setUiState({ ...uiState, showEditor: !uiState.showEditor });
      return;
    }
    if (name == "Preview") {
      if (!uiState.showEditor && uiState.showPreview) return;
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
