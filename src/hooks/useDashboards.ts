import {
  addDashboard,
  deleteDashboard,
  renameDashboard,
  selectDashboard,
  setConfig,
  setConfigScript,
} from "@/lib/redux/features/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

export const useDashboards = () => {
  const { byId, activeDashboardId } = useAppSelector(
    (state) => state.dashboards
  );
  const dispatch = useAppDispatch();

  const dashboards = Object.values(byId);

  const funcAddDashboard = (name: string) => {
    dispatch(addDashboard({ name }));
  };

  const funcDeleteDashboard = (id: string) => {
    dispatch(deleteDashboard({ id }));
  };

  const funRenameDashboard = (id: string, name: string) => {
    dispatch(renameDashboard({ id, name }));
  };

  const funcSelectDashboard = (id: string) => {
    dispatch(selectDashboard({ id }));
  };

  const funcSetConfig = (config: Record<string, any>) => {
    const id = activeDashboardId as string;
    dispatch(setConfig({ id, config }));
  };
  const funcSetConfigScript = (script: string) => {
    const id = activeDashboardId as string;
    dispatch(setConfigScript({ id, script }));
  };

  const funcGetConfigScript = () => {
    const id = activeDashboardId as string;
    return byId[id].configScript;
  };

  return {
    dashboards,
    addDashboard: funcAddDashboard,
    renameDashboard: funRenameDashboard,
    deleteDashboard: funcDeleteDashboard,
    selectDashboard: funcSelectDashboard,
    setConfig: funcSetConfig,
    setConfigScript: funcSetConfigScript,
    getConfigScript: funcGetConfigScript,
  };
};
