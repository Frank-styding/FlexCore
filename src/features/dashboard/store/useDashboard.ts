import { useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { Dashboard } from "../types/dashboard.types";
import { useDashboardStore } from "./dashboard.store";
import { useShallow } from "zustand/react/shallow";

export const useDashboardActions = (id?: string) => {
  const user = useUser();
  const params = useParams();

  const dashboardId =
    id ??
    (typeof params?.dashboardId === "string" ? params.dashboardId : undefined);

  // 🔹 UNA sola suscripción a Zustand
  const {
    dashboards,
    status,
    error,
    addDashboard,
    deleteDashboard,
    updateDashboard,
    fetchDashboards,
  } = useDashboardStore(
    useShallow((s) => ({
      dashboards: s.dashboards,
      status: s.status,
      error: s.error,
      addDashboard: s.addDashboard,
      deleteDashboard: s.deleteDashboard,
      updateDashboard: s.updateDashboard,
      fetchDashboards: s.fetchDashboards,
    }))
  );

  // 🔹 Lista
  const dashboardList = useMemo(() => Object.values(dashboards), [dashboards]);

  // 🔹 Actual
  const currentDashboard = dashboardId ? dashboards[dashboardId] : undefined;

  const requireDashboard = useCallback(() => {
    if (!dashboardId) {
      console.error("No hay dashboard seleccionado");
      return false;
    }
    return true;
  }, [dashboardId]);

  return {
    // Estado
    status,
    error,
    isLoading: status === "idle" || status === "loading",
    dashboards: dashboardList,
    dashboard: currentDashboard,

    // Acciones
    refresh: fetchDashboards,

    addDashboard: async (name: string) => {
      if (!user?.id) {
        console.warn("Intento de crear dashboard sin usuario autenticado");
        return;
      }
      await addDashboard(name, user.id);
    },

    deleteDashboard,

    updateDashboard: async (targetId: string, updates: Partial<Dashboard>) => {
      await updateDashboard(targetId, updates);
    },

    renameDashboard: (targetId: string, name: string) =>
      updateDashboard(targetId, { name }),

    setConfig: (config: Record<string, any>) => {
      if (requireDashboard()) {
        updateDashboard(dashboardId!, { config });
      }
    },

    setConfigScript: (script: string) => {
      if (requireDashboard()) {
        updateDashboard(dashboardId!, { configScript: script });
      }
    },
  };
};
