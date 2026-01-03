import { useEditorStore } from "@/features/engine/store/editor.store";
import {
  useScriptConnectionStore,
  adapter,
} from "@/features/engine/store/scriptConnection.store";

export const ConnectFunc = () => {
  const { setIsConnected, disconnect, setConfig, connect } =
    useScriptConnectionStore.getState();
  const { addExecutionLogs } = useEditorStore.getState();
  return async (
    config: { url: string; key: string; type: string },
    shouldSave: boolean = true
  ) => {
    try {
      if (adapter) {
        setIsConnected(false);
        await disconnect();
      }
      await connect(config);
      if (shouldSave) {
        setConfig(config);
      }
      setIsConnected(true);

      if (adapter) {
        addExecutionLogs([{ message: `System: Connected to ${adapter.name}` }]);
        return true;
      }
      return false;
    } catch (error: any) {
      if (adapter) {
        addExecutionLogs([{ message: `System: Connected to ${adapter.name}` }]);
      }
      throw error;
    }
  };
};
