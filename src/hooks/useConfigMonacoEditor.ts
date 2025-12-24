import { Monaco } from "@monaco-editor/react";
import { useEffect, useRef } from "react";

interface UseConfigMonacoProps {
  /** Ruta base para los archivos de tipos (ej: "ts:filename") */
  baseUri?: string;
  /** String con las definiciones estáticas (UI, Console, Utils) */
  globalDefinitions?: string;
  /** String con las definiciones dinámicas (Generadas por el SQL) */
  sqlDefinitions?: string;
}

export const useConfigMonacoEditor = ({
  baseUri = "ts:filename",
  globalDefinitions = "",
  sqlDefinitions = "",
}: UseConfigMonacoProps) => {
  const monacoRef = useRef<Monaco | null>(null);

  // 1. Configuración Inicial (Se ejecuta una sola vez al montar)
  const initCompilerOptions = (monaco: Monaco) => {
    const defaults = monaco.languages.typescript.javascriptDefaults;
    defaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      allowJs: true,
      checkJs: true,
      noLib: true, // Usamos nuestras propias libs
    });
  };

  // 2. Función para inyectar/actualizar GLOBAL (UI, Helpers)
  const updateGlobalLibs = () => {
    if (!monacoRef.current) return;
    const defaults = monacoRef.current.languages.typescript.javascriptDefaults;

    // Usamos una ruta específica para lo global
    const uri = `${baseUri}/globals.d.ts`;

    // addExtraLib devuelve un 'Disposable', lo ideal es limpiar el anterior si cambia,
    // pero Monaco maneja bien la sobrescritura si el path es el mismo.
    defaults.addExtraLib(globalDefinitions, uri);
  };

  // 3. Función para inyectar/actualizar SQL (Dinámico)
  const updateSqlLibs = () => {
    if (!monacoRef.current) return;
    const defaults = monacoRef.current.languages.typescript.javascriptDefaults;

    // Usamos una ruta distinta para lo dinámico
    const uri = `${baseUri}/sql-context.d.ts`;

    defaults.addExtraLib(sqlDefinitions, uri);
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    monacoRef.current = monaco;
    initCompilerOptions(monaco);
    // Forzamos la carga inicial de ambos
    updateGlobalLibs();
    updateSqlLibs();
  };

  // Efecto A: Solo se ejecuta si cambia la definición GLOBAL
  useEffect(() => {
    updateGlobalLibs();
  }, [globalDefinitions]);

  // Efecto B: Se ejecuta cada vez que cambia la definición SQL
  useEffect(() => {
    updateSqlLibs();
  }, [sqlDefinitions]);

  return { monacoRef, handleEditorDidMount };
};
