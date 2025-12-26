import {
  addExecutionLogs,
  clearConsole,
  setJsCode,
  setSqlCode,
} from "@/lib/redux/features/ScriptEditorSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { LogEntry } from "@/lib/runScript/runScript";

export const useScriptEditor = () => {
  const { jsCode, sqlCode, logs } = useAppSelector(
    (state) => state.scriptEditor
  );
  const dispatch = useAppDispatch();

  return {
    clearConsole: () => dispatch(clearConsole()),
    setJsCode: (script: string) => dispatch(setJsCode(script)), // Tipado explícito
    setSqlCode: (script: string) => dispatch(setSqlCode(script)), // Tipado explícito
    addExecutionLogs: (logs: LogEntry[], result?: any) =>
      dispatch(addExecutionLogs({ logs, result })),

    // Estado expuesto
    sqlCode,
    jsCode,
    logs,
  };
};
