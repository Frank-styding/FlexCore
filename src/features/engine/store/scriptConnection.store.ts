import { create } from "zustand";
import { DatabaseAdapter } from "../lib/connectionsAdapters/types";
import { SupabaseAdapter } from "../lib/connectionsAdapters/SupabaseAdapter";
import { MockAdapter } from "../lib/connectionsAdapters/MockAdapter";

interface ConnectionConfig {
  url: string;
  key: string;
  type: string;
}
interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  config: ConnectionConfig | null;
  error: string | null;
  setIsConnected: (value: boolean) => void;
  activeAdapter: DatabaseAdapter | null;
  connect: (config: ConnectionConfig) => Promise<void>;
  disconnect: () => Promise<void>;
  setConfig: (config: ConnectionConfig) => void;
}

const createAdapter = (type: string): DatabaseAdapter => {
  switch (type?.toLowerCase()) {
    case "supabase":
      return new SupabaseAdapter();
    case "mock":
      return new MockAdapter();
    default:
      throw new Error(`Tipo de base de datos no soportado: ${type}`);
  }
};

export const useScriptConnectionStore = create<ConnectionState>((set, get) => ({
  isConnected: false,
  isConnecting: false,
  error: null,
  activeAdapter: null,
  config: null,
  setConfig: (config) => set({ config }),
  disconnect: async () => {
    const { activeAdapter } = get();
    if (activeAdapter) {
      await activeAdapter.disconnect();
    }
    set({ isConnected: false, activeAdapter: null });
  },
  setIsConnected: (value) => {
    set({ isConnected: value });
  },
  connect: async (config: ConnectionConfig) => {
    set({ isConnecting: true, error: null, isConnected: false });

    try {
      await get().disconnect();
      const adapter = createAdapter(config.type);
      await adapter.connect(config);
      set({
        isConnected: adapter.isConnected(),
        isConnecting: false,
        activeAdapter: adapter,
        config: config,
        error: null,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Error desconocido al conectar";
      set({
        isConnected: false,
        isConnecting: false,
        error: errorMessage,
        activeAdapter: null,
      });
      throw err;
    }
  },
}));
