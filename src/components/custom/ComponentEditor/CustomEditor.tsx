import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Editor, OnMount } from "@monaco-editor/react";
import { Console, ILog } from "./Console";
import { useState } from "react";
import { Play } from "lucide-react";

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
}

export const ScriptEditor = ({
  onPlay,
  logs,
  onClean,
  onlyJs,
  onMount,
  disableConsole,
  jsValue,
  onChangeJs,
  onChangeSql,
  sqlValue,
}: CustomEditorProps) => {
  const [isJs, setIsJs] = useState(true);
  const [openConsole, setOpenConsole] = useState(!!disableConsole);

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

  return (
    <div className="h-full rounded-lg overflow-hidden grid grid-rows-[45px_1fr]">
      <div className="w-full bg-accent flex gap-3 items-center px-3">
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
            <Button
              className="h-8 transition-none duration-0"
              variant={openConsole ? "default" : "outline"}
              onClick={onToggleConsole}
            >
              Console
            </Button>
            <Button
              className="h-8 transition-none duration-0"
              variant="outline"
              onClick={onPlay}
            >
              <Play />
            </Button>
          </>
        )}
      </div>
      <div className="w-full flex">
        {!openConsole && (
          <div className="flex-1 min-w-0 h-full">
            {isJs || onlyJs ? (
              <Editor
                key={"js"}
                theme="vs-dark"
                onMount={onMount}
                value={jsValue}
                onChange={onChangeJs}
                language="javascript"
                options={editorOptions}
              />
            ) : (
              <Editor
                key={"sql"}
                theme="vs-dark"
                language="sql"
                value={sqlValue}
                onChange={onChangeSql}
                options={editorOptions}
              />
            )}
          </div>
        )}
        {openConsole && (
          <div className="flex-1 min-w-0 h-full border-l border-border">
            <Console logs={logs} onClean={onClean} />
          </div>
        )}
      </div>
    </div>
  );
};
