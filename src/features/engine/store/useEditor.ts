import { useCallback } from "react";
import { useEditorStore } from "./editor.store";
import { useDashboardActions } from "@/features/dashboard/store/useDashboard";
import { useShallow } from "zustand/react/shallow";

export const useEditor = () => {
  const {
    jsCode,
    sqlCode,
    logs,
    isEditing,
    setJsCode,
    setSqlCode,
    clearConsole,
    addExecutionLogs,
    setIsEditing,
    resetEditor,
  } = useEditorStore(
    useShallow((s) => ({
      jsCode: s.jsCode,
      sqlCode: s.sqlCode,
      logs: s.logs,
      isEditing: s.isEditing,
      setJsCode: s.setJsCode,
      setSqlCode: s.setSqlCode,
      clearConsole: s.clearConsole,
      addExecutionLogs: s.addExecutionLogs,
      setIsEditing: s.setIsEditing,
      resetEditor: s.resetEditor,
    }))
  );

  const {
    dashboard,
    setConfigScript,
    isLoading: isDashboardLoading,
  } = useDashboardActions();

  const loadScriptFromDashboard = useCallback(() => {
    if (dashboard?.configScript) {
      setJsCode(dashboard.configScript);
    }
  }, [dashboard, setJsCode]);

  const saveScriptToDashboard = useCallback(async () => {
    if (!dashboard) return;

    setConfigScript(jsCode);
    console.log("Script guardado en el dashboard:", dashboard.id);
  }, [dashboard, jsCode, setConfigScript]);

  return {
    jsCode,
    sqlCode,
    logs,
    isEditing,

    hasUnsavedChanges: dashboard?.configScript !== jsCode,
    isReady: !isDashboardLoading && !!dashboard,

    setJsCode,
    setSqlCode,
    clearConsole,
    addExecutionLogs,
    setIsEditing,
    resetEditor,

    // Integración Dashboard
    loadScriptFromDashboard,
    saveScriptToDashboard,
  };
};
