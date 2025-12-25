import {
  addExecutionLogs,
  clearConsole,
  ILog,
  setJsCode,
  setSqlCode,
} from "@/lib/redux/features/ScriptEditorSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

export const useScriptEditor = () => {
  const { jsCode, sqlCode, logs } = useAppSelector(
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

  return {
    clearConsole: funcClearConsole,
    setJsCode: funcSetJsCode,
    setSqlCode: funcSetSqlCode,
    sqlCode,
    jsCode,
    logs,
    addExecutionLogs: funcAddExecutionLogs,
  };
};
