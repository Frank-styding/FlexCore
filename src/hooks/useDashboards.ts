import {
  addDashboard,
  deleteDashboard,
  renameDashboard,
  selectDashboard,
} from "@/lib/redux/features/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

export const useDashboards = () => {
  const { byId } = useAppSelector((state) => state.dashboards);
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

  return {
    dashboards,
    addDashboard: funcAddDashboard,
    renameDashboard: funRenameDashboard,
    deleteDashboard: funcDeleteDashboard,
    selectDashboard: funcSelectDashboard,
  };
};
