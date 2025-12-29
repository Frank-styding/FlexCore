import { useCallback } from "react";
import { useScriptEditor } from "./useScriptEditor";
import { toast } from "sonner";

interface ErrorOptions {
  customMessage?: string;
  silent?: boolean; // Para no mostrar toast si falla
  rethrow?: boolean; // Por si quieres que el error siga subiendo
}

export const useScriptError = () => {
  const { addExecutionLogs, isEditing } = useScriptEditor();

  const execute = useCallback(
    async <T>(
      callback?: (...args: any) => Promise<T> | T,
      ...props: any[]
    ): Promise<T | undefined> => {
      if (!callback) return undefined;
      try {
        return await callback(...props);
      } catch (error: unknown) {
        // 1. Extraer el mensaje real del error
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;

        if (isEditing) {
          // 2. Logging detallado para el editor
          addExecutionLogs([
            {
              message: "RUNTIME ERROR",
              // Guardamos objeto estructurado para mejor visualización en logs
              data: [
                {
                  message: errorMessage,
                  stack: errorStack,
                  original: error,
                },
              ],
            },
          ]);
        } else {
          // 3. Manejo en producción
          console.error("Script Error:", error);

          toast.error("Se produjo un error", {
            description: errorMessage, // Opcional: mostrar el detalle técnico al usuario
          });
        }

        return undefined;
      }
    },
    [isEditing, addExecutionLogs]
  );

  return execute;
};
