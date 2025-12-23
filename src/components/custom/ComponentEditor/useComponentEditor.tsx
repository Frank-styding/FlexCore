import { useState, useCallback, useRef, useEffect } from "react";
import { Monaco } from "@monaco-editor/react";
import { parseSqlScript, runJs } from "@/lib/runJs/runJs"; // Asegúrate que la ruta sea correcta
import { ILog } from "./Console"; // Tu interfaz de logs

interface UseComponentEditorProps {
  initialSql: string;
  initialScript: string;
}

// URI único para nuestra librería virtual
const LIB_URI = "ts:filename/component-editor-context.d.ts";

export const useComponentEditor = ({
  initialSql,
  initialScript,
}: UseComponentEditorProps) => {
  // --- Estados ---
  const [sqlCode, setSqlCode] = useState(initialSql);
  const [jsCode, setJsCode] = useState(initialScript);
  const [logs, setLogs] = useState<ILog[]>([]);

  const [uiState, setUiState] = useState({
    showPreview: true,
    showEditor: true,
    showConsole: true,
    currentTab: "JS",
  });

  const monacoRef = useRef<Monaco | null>(null);

  // --- Lógica de Tabs ---
  const toggleTab = (name: string) => {
    if (name === "Console") {
      setUiState((prev) => ({ ...prev, showConsole: !prev.showConsole }));
      return;
    }
    if (name === "preview") {
      setUiState((prev) => {
        if (prev.showPreview && !prev.showEditor) {
          return { ...prev, showEditor: true, showPreview: !prev.showPreview };
        }
        return { ...prev, showPreview: !prev.showPreview };
      });
      return;
    }
    if (name === uiState.currentTab) {
      setUiState((prev) => ({ ...prev, showEditor: !prev.showEditor }));
      return;
    }
    setUiState((prev) => ({ ...prev, currentTab: name, showEditor: true }));
  };

  // --- Lógica de Ejecución ---
  const runPipeline = useCallback(() => {
    // runJs ya maneja la inyección de QUERIES y execQuery internamente
    const { logs: executionLogs, result } = runJs(jsCode, sqlCode);

    const newLogs = executionLogs.map((l) => ({ step: "JS", ...l }));
    setLogs((prev) => [...prev, ...newLogs]);

    if (result !== undefined) {
      setLogs((prev) => [
        ...prev,
        { step: "System", message: "Result:", data: result },
      ]);
    }
  }, [jsCode, sqlCode]);

  const clearLogs = () => setLogs([]);

  // --- Lógica de Monaco e Intellisense ---
  const updateMonacoTypes = (sqlText: string) => {
    if (!monacoRef.current) return;

    const queries = parseSqlScript(sqlText);
    const queryKeys = Object.keys(queries);

    // 1. Generamos solo las propiedades del objeto QUERIES
    // Esto genera algo como: "getUsers": string; "updateItem": string;
    const queriesObjProperties = queryKeys
      .map((k) => `  ${JSON.stringify(k)}: string;`)
      .join("\n");

    const typeDefinitions = `
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
    `;

    const monaco = monacoRef.current;
    const defaults = monaco.languages.typescript.javascriptDefaults;

    // Configuración del compilador para JS suelto
    defaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      allowJs: true,
      checkJs: true, // Importante para que sugiera strings
      noLib: true,
    });

    defaults.addExtraLib(typeDefinitions, LIB_URI);
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    monacoRef.current = monaco;
    updateMonacoTypes(sqlCode);
  };

  // Actualizar tipos cada vez que cambia el SQL
  useEffect(() => {
    updateMonacoTypes(sqlCode);
  }, [sqlCode]);

  return {
    sqlCode,
    setSqlCode,
    jsCode,
    setJsCode,
    logs,
    uiState,
    toggleTab,
    runPipeline,
    clearLogs,
    handleEditorDidMount,
  };
};
