import { useScriptConnectionStore } from "./scriptConnection.store";
export const useScriptConnection = () => {
  const isConnected = useScriptConnectionStore((s) => s.isConnected);
  const isConnecting = useScriptConnectionStore((s) => s.isConnecting);
  const error = useScriptConnectionStore((s) => s.error);
  const config = useScriptConnectionStore((s) => s.config);
  const activeAdapter = useScriptConnectionStore((s) => s.activeAdapter);
  const connect = useScriptConnectionStore((s) => s.connect);
  const disconnect = useScriptConnectionStore((s) => s.disconnect);
  const setConfig = useScriptConnectionStore((s) => s.setConfig);
  const setIsConnected = useScriptConnectionStore((s) => s.setIsConnected);

  return {
    isConnected,
    setIsConnected,
    isConnecting,
    error,
    activeAdapter,
    connect,
    disconnect,
    setConfig,
    config,
  };
};
