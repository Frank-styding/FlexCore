import { toast } from "sonner";
import { processSqlTemplate } from "../../../lib/runScript/processSqlTemplate";
import { useScriptConnectionStore } from "@/features/engine/store/scriptConnection.store";
import { useEditorStore } from "@/features/engine/store/editor.store";

export const ExecQuery = () => {
  const { activeAdapter } = useScriptConnectionStore.getState();
  const { addExecutionLogs } = useEditorStore.getState();
  return async (query: string, context?: Record<string, any>) => {
    if (!query) return [];
    if (!activeAdapter || !activeAdapter.isConnected()) {
      const errorMsg = "No hay una conexión activa. Verifica la configuración.";
      toast.error("Error de Ejecución", {
        description: errorMsg,
      });

      return [];
    }
    const processedQuery = context ? processSqlTemplate(query, context) : query;
    const start = performance.now();
    const result = await activeAdapter.execute(processedQuery);
    const end = performance.now();
    addExecutionLogs([
      {
        message: `Query Executed (${(end - start).toFixed(2)}ms)`,
        data: [
          processedQuery,
          result.message || `Rows: ${result.data?.length}`,
        ],
      },
    ]);
    if (result.error) {
      throw new Error(result.error);
    }

    return result.data || [];
  };
};
