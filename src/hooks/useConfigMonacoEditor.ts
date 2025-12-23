import { Monaco } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

export const useConfigMonacoEditor = (
  LIB_URI: string,
  definitionsFn: () => string
) => {
  const monacoRef = useRef<Monaco | null>(null);
  const updateMonacoTypes = () => {
    if (!monacoRef.current) return;

    const monaco = monacoRef.current;
    const defaults = monaco.languages.typescript.javascriptDefaults;
    const typeDefinitions = definitionsFn();
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
    updateMonacoTypes();
  };

  // Actualizar tipos cada vez que cambia el SQL
  useEffect(() => {
    updateMonacoTypes();
  }, [definitionsFn]);

  return { monacoRef, handleEditorDidMount };
};
