import { useEditorStore } from "@/features/engine/store/editor.store";
import { useScriptConnectionStore } from "@/features/engine/store/scriptConnection.store";

export const ConnectFunc = () => {
  const { activeAdapter, setIsConnected, disconnect, setConfig, connect } =
    useScriptConnectionStore.getState();
  const { addExecutionLogs } = useEditorStore.getState();
  return async (
    config: { url: string; key: string; type: string },
    shouldSave: boolean = true
  ) => {
    try {
      if (activeAdapter) {
        setIsConnected(false);
        await disconnect();
      }
      await connect(config);
      if (shouldSave) {
        setConfig(config);
      }
      setIsConnected(true);
      if (activeAdapter) {
        addExecutionLogs([
          { message: `System: Connected to ${activeAdapter.name}` },
        ]);
      }
      return true;
    } catch (error: any) {
      if (activeAdapter) {
        addExecutionLogs([
          { message: `System: Connected to ${activeAdapter.name}` },
        ]);
      }
      throw error;
    }
  };
};
