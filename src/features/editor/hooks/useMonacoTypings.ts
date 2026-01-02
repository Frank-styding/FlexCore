import { Monaco } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

export interface TypeDefinition {
  path: string;
  content: string;
}

interface UseMonacoTypingsProps {
  definitions: TypeDefinition[];
  compilerOptions?: any;
}

export const useMonacoTypings = ({
  definitions,
  compilerOptions,
}: UseMonacoTypingsProps) => {
  const monacoRef = useRef<Monaco | null>(null);
  // Guardamos las funciones de limpieza (dispose) aquí
  const disposablesRef = useRef<any[]>([]);

  const initCompiler = (monaco: Monaco) => {
    const defaults = monaco.languages.typescript.javascriptDefaults;
    defaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020, // ESNext a veces es inestable, 2020 es seguro
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      allowJs: true,
      checkJs: true, // Esto habilita el intellisense fuerte en JS
      noLib: false,
      ...compilerOptions,
    });
  };

  const updateLibs = () => {
    if (!monacoRef.current) return;
    const defaults = monacoRef.current.languages.typescript.javascriptDefaults;

    // 1. LIMPIEZA: Eliminamos las definiciones anteriores para evitar duplicados o residuos
    disposablesRef.current.forEach((d) => d.dispose());
    disposablesRef.current = [];

    // 2. INYECCIÓN
    definitions.forEach((def) => {
      // Normalizamos la URI. Monaco prefiere 'file:///' para simular sistema de archivos
      const uriString = def.path.startsWith("file:///")
        ? def.path
        : `file:///${def.path.replace("ts:filename/", "")}`; // Limpieza por si acaso

      const uri = monacoRef.current!.Uri.parse(uriString);

      // Añadimos la librería y guardamos el disposable
      const disposable = defaults.addExtraLib(def.content, uri.toString());
      disposablesRef.current.push(disposable);
    });
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    monacoRef.current = monaco;
    initCompiler(monaco);
    updateLibs();
  };

  useEffect(() => {
    updateLibs();

    // Cleanup final cuando el componente se desmonta por completo
    return () => {
      disposablesRef.current.forEach((d) => d.dispose());
    };
  }, [definitions]);

  return { handleEditorDidMount };
};
