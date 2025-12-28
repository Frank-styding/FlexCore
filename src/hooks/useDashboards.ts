import {
  addDashboardRemote,
  deleteDashboardRemote,
  updateDashboardRemote,
} from "@/lib/redux/features/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation"; // <--- 1. Importar useParams

// Permitimos que el ID sea opcional
export const useDashboards = (id?: string) => {
  const { user } = useUser();
  const params = useParams(); // <--- 2. Leer params
  const dashboardId = id || (params?.dashboardId as string);
  const { byId, status } = useAppSelector((state) => state.dashboards);
  const dispatch = useAppDispatch();
  const dashboards = Object.values(byId);
  return {
    dashboards,
    isLoading: status === "idle",

    addDashboard: (name: string) => {
      if (user) {
        dispatch(addDashboardRemote({ name, userId: user.id }));
      } else {
        console.warn("Intento de crear Dashboard sin usuario autenticado");
      }
    },

    deleteDashboard: (targetId: string) =>
      dispatch(deleteDashboardRemote(targetId)),

    renameDashboard: (targetId: string, name: string) =>
      dispatch(updateDashboardRemote({ id: targetId, updates: { name } })),

    setConfig: (config: Record<string, any>) => {
      // Ahora dashboardId tiene valor gracias a useParams
      if (dashboardId) {
        dispatch(
          updateDashboardRemote({
            id: dashboardId,
            updates: { config },
          })
        );
      } else {
        console.error("No se pudo guardar la configuración: Falta dashboardId");
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
      } else {
        console.error("No se pudo guardar el script: Falta dashboardId");
      }
    },

    getConfigScript: () => {
      return dashboardId ? byId[dashboardId]?.configScript : "";
    },
  };
};
