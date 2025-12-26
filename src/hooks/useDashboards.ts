import {
  addDashboardRemote,
  deleteDashboardRemote,
  updateDashboardRemote,
} from "@/lib/redux/features/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useUser } from "@/hooks/useUser"; // <--- 1. Importamos el hook de usuario

export const useDashboards = (dashboardId?: string) => {
  // 2. Obtenemos el usuario autenticado
  const { user } = useUser();

  const { byId, status } = useAppSelector((state) => state.dashboards);
  const dispatch = useAppDispatch();
  const dashboards = Object.values(byId);

  return {
    dashboards,
    /*     activeDashboardId, */
    isLoading: status === "idle",

    // 3. Modificamos addDashboard para NO pedir userId como parámetro,
    // sino tomarlo del contexto de auth.
    addDashboard: (name: string) => {
      if (user) {
        dispatch(addDashboardRemote({ name, userId: user.id }));
      } else {
        console.warn("Intento de crear Dashboard sin usuario autenticado");
      }
    },

    deleteDashboard: (id: string) => dispatch(deleteDashboardRemote(id)),

    renameDashboard: (id: string, name: string) =>
      dispatch(updateDashboardRemote({ id, updates: { name } })),

    setConfig: (config: Record<string, any>) => {
      if (dashboardId) {
        dispatch(
          updateDashboardRemote({
            id: dashboardId,
            updates: { config },
          })
        );
      }
    },

    setConfigScript: (script: string) => {
      if (dashboardId) {
        dispatch(
          updateDashboardRemote({
            id: dashboardId,
            updates: { configScript: script },
          })
        );
      }
    },

    getConfigScript: () => {
      return dashboardId ? byId[dashboardId]?.configScript : "";
    },
  };
};
