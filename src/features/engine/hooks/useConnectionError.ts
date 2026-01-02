import { useCallback } from "react";
import { toast } from "sonner";
import { useEditor } from "../store/useEditor";

export const useScriptError = () => {
  const { isEditing, addExecutionLogs } = useEditor();
  const execute = useCallback(
    async <T>(
      callback?: (...args: any) => Promise<T> | T,
      ...props: any[]
    ): Promise<T | undefined> => {
      if (!callback) return undefined;
      try {
        return await callback(...props);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        if (isEditing) {
          addExecutionLogs([
            {
              message: "RUNTIME ERROR",
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
          console.error("Script Error:", error);
          toast.error("Se produjo un error", {
            description: errorMessage,
          });
        }
        return undefined;
      }
    },
    [isEditing, addExecutionLogs]
  );

  return execute;
};
