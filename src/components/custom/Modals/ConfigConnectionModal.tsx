import { ScriptEditor } from "@/components/custom/ComponentEditor/ScriptEditor";
import { useCodeDefinitions } from "@/components/custom/ComponentEditor/useCodeDefinitions";
import { Modal, ModalProps } from "@/components/custom/Modal";
import { useDashboards } from "@/hooks/useDashboards";
import { useScriptActions } from "@/hooks/useScriptActions";
import { useScriptEditor } from "@/hooks/useScriptEditor";

import { runScript } from "@/lib/runScript/runScript";
import { useEffect } from "react";

type ConfigConnectionModalProps = ModalProps & {};
export const ConfigConnectionModal = (props: ConfigConnectionModalProps) => {
  const { jsCode, setJsCode, clearConsole, logs } = useScriptEditor();
  const { setConfigScript, getConfigScript } = useDashboards();
  const scriptContext = useScriptActions();
  const { globalDefinitions } = useCodeDefinitions({});
  const onConnect = () => {
    if (!jsCode) return;
    runScript(jsCode, "", scriptContext);
    setConfigScript(jsCode);
  };

  const handleChangeJs = (v) => {
    setJsCode(v || "");
  };
  const onClean = () => {
    clearConsole();
  };

  useEffect(() => {
    setJsCode(getConfigScript());
    return () => {
      onClean();
    };
  }, []);

  return (
    <Modal
      {...props}
      className="min-w-[80vw] min-h-[70vh] grid grid-rows-[10px_auto_1fr]"
      disableEscape
      disableOutside
    >
      <div className="w-full h-full grid grid-rows-[1fr] gap-2">
        <ScriptEditor
          onChangeJs={handleChangeJs}
          jsValue={jsCode ?? ""}
          onSave={onConnect}
          globalDefinitions={globalDefinitions}
          sqlDefinitions={""}
          onPlay={onConnect}
          logs={logs}
          onlyJs
          alwaysOpenConsole
          onClean={onClean}
        />
      </div>
    </Modal>
  );
};
