import { ScriptEditor } from "@/components/custom/ComponentEditor/ScriptEditor";
import { useCodeDefinitions } from "@/hooks/useCodeDefinitions";
import { Modal, ModalProps } from "@/components/custom/Modal";
import { useDashboards } from "@/hooks/useDashboards";
import { useScriptEditor } from "@/hooks/useScriptEditor";

import { runScript } from "@/lib/runScript/runScript";
import { useEffect } from "react";
import { useModals } from "@/components/providers/ModalProvider";
import { useScriptConnectionActions } from "@/hooks/useScriptConnectionActions";

type ConfigConnectionModalProps = ModalProps & {};
export const ConfigConnectionModal = (props: ConfigConnectionModalProps) => {
  const { jsCode, setJsCode, clearConsole, logs } = useScriptEditor();
  const { setConfigScript, getConfigScript } = useDashboards();
  const scriptContext = useScriptConnectionActions();
  const { definitions } = useCodeDefinitions({ contextType: "DBConfig" });
  const { isModalOpen } = useModals();
  const isOpen = isModalOpen(props.id);
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
    // Si isOpen es true, significa que se acaba de abrir (o ya estaba abierto)
    if (isOpen) {
      setJsCode(getConfigScript());
    } else {
      // Opcional: Limpiar cuando se cierra
      onClean();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

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
          definitions={definitions}
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
