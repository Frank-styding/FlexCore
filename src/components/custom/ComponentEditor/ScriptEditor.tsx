import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Editor, OnMount } from "@monaco-editor/react";
import { Console, ILog } from "./Console";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { useMonacoTypings, TypeDefinition } from "@/hooks/useMonacoTypings";

export interface CustomEditorProps {
  onPlay?: () => void;
  logs?: ILog[];
  onClean?: () => void;
  onlyJs?: boolean;
  onMount?: OnMount;
  jsValue?: string;
  onChangeJs?: (value?: string) => void;
  sqlValue?: string;
  onChangeSql?: (value?: string) => void;
  disableConsole?: boolean;
  onSave?: () => void;
  globalDefinitions?: string;
  alwaysOpenConsole?: boolean;
  definitions?: TypeDefinition[];
}

export const ScriptEditor = ({
  onPlay,
  logs,
  onClean,
  onlyJs,
  disableConsole,
  jsValue,
  onChangeJs,
  onChangeSql,
  sqlValue,
  onSave,
  alwaysOpenConsole,
  definitions = [],
}: CustomEditorProps) => {
  const { handleEditorDidMount } = useMonacoTypings({
    definitions: definitions,
  });

  const [isJs, setIsJs] = useState(true);
  const [openConsole, setOpenConsole] = useState(false);

  const onTab = (name: string) => {
    if (name == "js") setIsJs(true);
    else setIsJs(false);
  };

  const onToggleConsole = () => {
    setOpenConsole(!openConsole);
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 15,
    padding: { top: 10 },
    automaticLayout: true,
    scrollBeyondLastLine: false,
  };

  const handleOnPlay = () => {
    onPlay?.();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Verifica si se presiona Ctrl (Win/Linux) o Meta (Mac) junto con la tecla 's'
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S")) {
        e.preventDefault(); // 🛑 Importante: Bloquea el "Guardar página" del navegador

        if (onSave) {
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
  const showHeader = !(onlyJs && disableConsole);
  return (
    // CAMBIO 1: Usamos flex flex-col en lugar de grid. h-full es crítico.
    <div className="flex flex-col h-full w-full rounded-lg overflow-hidden bg-background">
      {/* Header: Usamos flex-none para que no se encoja ni crezca */}
      {showHeader && (
        <div className="flex-none h-[45px] w-full bg-accent flex gap-3 items-center px-3 border-b border-border">
          {!onlyJs && (
            <ButtonGroup>
              <Button
                className="h-8 transition-none duration-0"
                variant={isJs ? "default" : "outline"}
                onClick={() => onTab("js")}
              >
                JS
              </Button>
              <Button
                className="h-8 transition-none duration-0"
                variant={!isJs ? "default" : "outline"}
                onClick={() => onTab("sql")}
              >
                SQL
              </Button>
            </ButtonGroup>
          )}

          {!disableConsole && (
            <>
              {!alwaysOpenConsole && (
                <Button
                  className="h-8 transition-none duration-0"
                  variant={openConsole ? "default" : "outline"}
                  onClick={onToggleConsole}
                >
                  Console
                </Button>
              )}

              <Button
                className="h-8 transition-none duration-0"
                variant="outline"
                onClick={handleOnPlay}
              >
                <Play />
              </Button>
            </>
          )}
        </div>
      )}

      {/* CAMBIO 2: Área de contenido
          flex-1: Toma todo el espacio restante.
          min-h-0: CRUCIAL. Permite que flexbox reduzca el tamaño del hijo si el contenido interno (ScrollArea) es muy grande.
          overflow-hidden: Asegura que nada se salga visualmente.
      */}
      <div className="flex-1 min-h-0 flex w-full overflow-hidden">
        {(!openConsole || alwaysOpenConsole) && (
          <div className="flex-1 min-w-0 h-full relative">
            {isJs || onlyJs ? (
              <Editor
                key={"js"}
                theme="vs-dark"
                onMount={handleEditorDidMount}
                value={jsValue}
                onChange={onChangeJs}
                language="javascript"
                options={editorOptions}
                className="absolute inset-0" // Forzamos al editor a llenar su contenedor
              />
            ) : (
              <Editor
                key={"sql"}
                theme="vs-dark"
                language="sql"
                value={sqlValue}
                onChange={onChangeSql}
                options={editorOptions}
                className="absolute inset-0"
              />
            )}
          </div>
        )}

        {(openConsole || alwaysOpenConsole) && (
          <div className="flex-1 min-w-0 h-full border-l border-border relative">
            {/* El Console ahora vivirá dentro de este contenedor flex estrictamente */}
            <div className="absolute inset-0">
              <Console logs={logs} onClean={onClean} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
