import {
  addExecutionLogs,
  clearConsole,
  setIsEditing,
  setJsCode,
  setSqlCode,
} from "@/lib/redux/features/ScriptEditorSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { LogEntry } from "@/lib/runScript/runScript";
import { useCallback } from "react";

export const useScriptEditor = () => {
  const { jsCode, sqlCode, logs, isEditing } = useAppSelector(
    (state) => state.scriptEditor
  );
  const dispatch = useAppDispatch();

  const handleClearConsole = useCallback(() => {
    dispatch(clearConsole());
  }, [dispatch]);

  const handleSetJsCode = useCallback(
    (script: string) => {
      dispatch(setJsCode(script));
    },
    [dispatch]
  );

  const handleSetSqlCode = useCallback(
    (script: string) => {
      dispatch(setSqlCode(script));
    },
    [dispatch]
  );

  const handleAddExecutionLogs = useCallback(
    (logs: LogEntry[], result?: any) => {
      dispatch(addExecutionLogs({ logs, result }));
    },
    [dispatch]
  );
  const handleSetIsEditing = useCallback(
    (isEditing: boolean) => {
      dispatch(setIsEditing(isEditing));
    },
    [dispatch]
  );

  return {
    clearConsole: handleClearConsole,
    setJsCode: handleSetJsCode,
    setSqlCode: handleSetSqlCode,
    addExecutionLogs: handleAddExecutionLogs,
    setIsEditing: handleSetIsEditing,
    sqlCode,
    jsCode,
    logs,
    isEditing,
  };
};
