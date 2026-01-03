import { Modal, ModalProps } from "@/components/shared/Modal";
import { useDashboardActions } from "@/features/dashboard/store/useDashboard";
import { useEditor, useEngine } from "@/features/engine";
import { useIsModalOpen } from "@/hooks/useModal";
import { useEffect, useState } from "react";
import { IEngine } from "@/features/engine/modules";
import { useCodeDefinitions } from "../../hooks/useCodeDefinitions";
import dynamic from "next/dynamic";
const ScriptEditor = dynamic(
  () => import("../editor/ScriptEditor").then((mod) => mod.ScriptEditor),
  {
    ssr: false,
    loading: () => <p>Cargando editor...</p>,
  }
);

type ConfigConnectionModalProps = ModalProps & {};
export const ConfigConnectionModal = (props: ConfigConnectionModalProps) => {
  const { jsCode, setJsCode, clearConsole, logs } = useEditor();
  const { setConfigScript, dashboard } = useDashboardActions();
  const isOpen = useIsModalOpen(props.id);

  const { createEngine, runScript } = useEngine();

  const [engine, setEngine] = useState<IEngine | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEngine(createEngine({ include: ["Connect"] }));
  }, []);

  const { definitions } = useCodeDefinitions({ engine });

  const onConnect = async () => {
    if (!jsCode) return;
    if (engine) {
      await runScript(jsCode, "", engine);
    }
    setConfigScript(jsCode);
  };

  const handleChangeJs = (v) => {
    setJsCode(v || "");
  };

  const onClean = () => {
    clearConsole();
  };

  useEffect(() => {
    if (isOpen) {
      setJsCode(dashboard?.configScript ?? "");
    } else {
      onClean();
    }
  }, [isOpen, dashboard]);

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
