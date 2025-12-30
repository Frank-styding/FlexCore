import { useCallback } from "react";
import { useDashboards } from "./useDashboards";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addExecutionLogs } from "@/lib/redux/features/ScriptEditorSlice";
import { DatabaseAdapter } from "@/lib/db-adapters/types";
import { SupabaseAdapter } from "@/lib/db-adapters/SupabaseAdapter";
import { MockAdapter } from "@/lib/db-adapters/MockAdapter";
import { processSqlTemplate } from "@/lib/runScript/runScript";
import { toast } from "sonner";
import { useDBConnection } from "./useDBConnection";

// 1. SINGLETON: Variable fuera del hook para compartir la conexión entre componentes
let activeAdapter: DatabaseAdapter | null = null;

export const useScriptConnectionActions = () => {
  const { setConfig } = useDashboards();
  const { setIsConnected } = useDBConnection();
  const dispatch = useAppDispatch();

  // 2. Ejecutar Query (Usa la instancia global)
  const execQuery = useCallback(
    async (query: string, context?: Record<string, any>) => {
      if (!query) return [];
      if (!activeAdapter || !activeAdapter.isConnected()) {
        const errorMsg =
          "No hay una conexión activa. Verifica la configuración.";

        // Notificación visual de error
        toast.error("Error de Ejecución", {
          description: errorMsg,
        });

        return [];
      }

      const processedQuery = context
        ? processSqlTemplate(query, context)
        : query;

      const start = performance.now();
      const result = await activeAdapter.execute(processedQuery);
      const end = performance.now();
      /* 
      dispatch(
        addExecutionLogs({
          logs: [
            {
              message: `Query Executed (${(end - start).toFixed(2)}ms)`,
              data: [
                processedQuery,
                result.message || `Rows: ${result.data?.length}`,
              ],
            },
          ],
        })
      );
 */
      if (result.error) {
        throw new Error(result.error);
      }

      return result.data || [];
    },
    [dispatch]
  );

  // 3. Conectar (Actualiza la instancia global)
  const ConectionConfig = useCallback(
    async (
      config: { url: string; key: string; type: string },
      shouldSave: boolean = true
    ) => {
      try {
        // Desconectar anterior si existe
        if (activeAdapter) {
          await activeAdapter.disconnect();
          setIsConnected(false);

          activeAdapter = null;
        }

        // Factory de adaptadores
        let newAdapter: DatabaseAdapter;
        switch (config.type?.toLowerCase()) {
          case "supabase":
            newAdapter = new SupabaseAdapter();
            break;
          case "mock":
            newAdapter = new MockAdapter();
            break;
          default:
            // Si no hay tipo, no lanzamos error crítico, solo no conectamos
            if (!config.type) return;
            throw new Error(
              `Tipo de base de datos no soportado: ${config.type}`
            );
        }

        // Conectar
        await newAdapter.connect(config);
        activeAdapter = newAdapter; // Guardar en variable global

        // Actualizar Redux
        if (shouldSave) {
          setConfig(config);
        }
        setIsConnected(true);

        dispatch(
          addExecutionLogs({
            logs: [{ message: `System: Connected to ${newAdapter.name}` }],
          })
        );

        return true; // Retornamos true para saber que tuvo éxito
      } catch (error: any) {
        dispatch(
          addExecutionLogs({
            logs: [
              { message: "System: Connection Error", data: [error.message] },
            ],
          })
        );
        throw error;
      }
    },
    [dispatch, setConfig]
  );

  return {
    execQuery,
    ConectionConfig,
  };
};

export const ConnectionActionsTypes = `
declare function execQuery(query: string,context?:Record<string,any>): Promise<any[]>;
declare function ConectionConfig(config: { url: string, key: string, type: "supabase" | "mock" }): Promise<void>;
`;
