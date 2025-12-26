import {
  addExecutionLogs,
  clearConsole,
  ILog,
  setIsEditingBy,
  setJsCode,
  setSqlCode,
} from "@/lib/redux/features/ScriptEditorSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

export const useScriptEditor = () => {
  const { jsCode, sqlCode, logs, isEditingBy } = useAppSelector(
    (state) => state.scriptEditor
  );
  const dispatch = useAppDispatch();

  const funcClearConsole = () => {
    dispatch(clearConsole());
  };
  const funcSetJsCode = (script) => {
    dispatch(setJsCode(script));
  };
  const funcSetSqlCode = (script) => {
    dispatch(setSqlCode(script));
  };
  const funcAddExecutionLogs = (logs: ILog[], result?: any) => {
    dispatch(addExecutionLogs({ logs, result }));
  };

  const funcSetIsEditingBy = (value?: string | undefined) => {
    dispatch(setIsEditingBy(value));
  };

  return {
    clearConsole: funcClearConsole,
    setJsCode: funcSetJsCode,
    setSqlCode: funcSetSqlCode,
    sqlCode,
    jsCode,
    logs,
    isEditingBy,
    setIsEditingBy: funcSetIsEditingBy,
    addExecutionLogs: funcAddExecutionLogs,
  };
};
