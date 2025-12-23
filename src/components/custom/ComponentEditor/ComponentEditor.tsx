"use client";

import { ButtonGroup } from "@/components/ui/button-group";
import { Tap } from "./Tap";
import { Button } from "@/components/ui/button";
import { TabContainer } from "./TabContainer";
import { TabContent } from "./TabContent";
import { Play } from "lucide-react";
import { Console } from "./Console";
import { ScriptEditor } from "./CustomEditor";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/hooks/useSearch";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { parseSqlScript } from "@/lib/runScript/runScript";
import { useConfigMonacoEditor } from "@/hooks/useConfigMonacoEditor";
import {
  clearConsole,
  executeScript,
  setJsCode,
  setSqlCode,
} from "@/lib/redux/features/ScriptEditorSlice";

interface ScriptEditorProps {
  initialSql?: string;
  initialScript?: string;
  defaultContextVariables?: Record<string, any>;
}
const LIB_URI = "ts:filename/component-editor-context.d.ts";

export const ComponentEditor = ({
  initialSql = "SELECT * FROM items WHERE parent_id = {{parentId}}",
  initialScript = "// Tienes acceso a 'sqlData' y 'variables'\nconst processed = sqlData.map(item => item.name);\nreturn processed;",
}: ScriptEditorProps) => {
  const { jsCode, sqlCode, logs, result } = useAppSelector(
    (state) => state.scriptEditor
  );
  const dispatch = useAppDispatch();

  const [uiState, setUiState] = useState({
    showEditor: true,
    showPreview: true,
  });

  useEffect(() => {
    dispatch(setJsCode(initialScript));
    dispatch(setSqlCode(initialSql));
  }, []);

  const { handleEditorDidMount } = useConfigMonacoEditor(
    LIB_URI,
    useCallback(() => {
      const queries = parseSqlScript(sqlCode);
      const queryKeys = Object.keys(queries);

      const queriesObjProperties = queryKeys
        .map((k) => `  ${JSON.stringify(k)}: string;`)
        .join("\n");

      return `
      /**
       * Objeto que contiene tus consultas SQL.
       * Úsalo como QUERIES.nombreDeConsulta
       */
      declare const QUERIES: {
      ${queriesObjProperties}
      };

      /**
       * Ejecuta una consulta SQL por su nombre.
       * @param queryName El nombre exacto de la query (Autocompletado disponible)
       */
      // EL TRUCO: Usar keyof typeof QUERIES vincula la función al objeto que ya funciona
      declare function execQuery(query:string,context?:Record<string,any>): any[];

      /** Variables de contexto global */
      declare const context: Record<string, any>;
      declare const console: {
        log(...args: any[]): void;
        warn(...args: any[]): void;
        error(...args: any[]): void;
      };
    `;
    }, [sqlCode])
  );

  const onChangeJs = (v) => dispatch(setJsCode(v || ""));
  const onChangeSql = (v) => dispatch(setSqlCode(v || ""));
  const onExecuteScript = () => dispatch(executeScript());

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
            onChangeSql={onChangeSql}
            jsValue={jsCode}
            onChangeJs={onChangeJs}
            logs={logs}
            onClean={() => dispatch(clearConsole())}
            onPlay={onExecuteScript}
          />
        </TabContainer>
        <TabContainer show={uiState.showPreview}>HOla</TabContainer>
      </div>
    </div>
  );
};
