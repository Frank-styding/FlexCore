import { Monaco } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

export interface TypeDefinition {
  /** Nombre del archivo virtual (ej: "libs/console.d.ts") */
  path: string;
  /** Contenido de la definición (declare const...) */
  content: string;
}

interface UseMonacoTypingsProps {
  /** Array de definiciones a inyectar */
  definitions: TypeDefinition[];
  /** Opciones de compilación extra si las necesitas */
  compilerOptions?: any; // monaco.languages.typescript.CompilerOptions
}

export const useMonacoTypings = ({
  definitions,
  compilerOptions,
}: UseMonacoTypingsProps) => {
  const monacoRef = useRef<Monaco | null>(null);

  // Configuramos el compilador una sola vez
  const initCompiler = (monaco: Monaco) => {
    const defaults = monaco.languages.typescript.javascriptDefaults;
    defaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      allowJs: true,
      checkJs: true,
      noLib: true, // Importante: usaremos nuestras propias libs
      ...compilerOptions,
    });
  };

  const updateLibs = () => {
    if (!monacoRef.current) return;
    const defaults = monacoRef.current.languages.typescript.javascriptDefaults;

    // Inyectamos cada definición como una librería extra
    definitions.forEach((def) => {
      // "ts:filename/" es un prefijo estándar para que Monaco lo trate como archivo local
      const uri = `ts:filename/${def.path}`;
      // addExtraLib retorna un disposable, pero Monaco maneja actualizaciones
      // automáticamente si la URI es la misma.
      defaults.addExtraLib(def.content, uri);
    });
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    monacoRef.current = monaco;
    initCompiler(monaco);
    updateLibs();
  };

  // Actualizar cuando cambien las definiciones (dinámico)
  useEffect(() => {
    updateLibs();
  }, [definitions]);

  return { handleEditorDidMount };
};
