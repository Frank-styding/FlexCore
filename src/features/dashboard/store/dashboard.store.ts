import { create } from "zustand";
import { systemSupabase } from "@/lib/supabase/client";
import { Dashboard } from "../types/dashboard.types";

interface DashboardState {
  dashboards: Record<string, Dashboard>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  fetchDashboards: () => Promise<void>;
  getDashboardById: (id: string) => Dashboard | undefined;
  addDashboard: (name: string, userId: string) => Promise<void>;
  deleteDashboard: (id: string) => Promise<void>;
  renameDashboard: (id: string, newName: string) => Promise<void>;
  updateDashboard: (id: string, updates: Partial<Dashboard>) => Promise<void>;
}

const DBtoStore = (item: any): Dashboard => {
  return {
    id: item.id,
    name: item.name,
    config: item.config,
    configScript: item.config_script,
  };
};

const StoreToDB = (item: Partial<Dashboard>) => {
  const dbEntry = {
    id: item.id, // Si es undefined, lo filtraremos abajo
    name: item.name,
    config: item.config,
    config_script: item.configScript,
    updated_at: new Date().toISOString(), // Buena práctica
  };

  return Object.fromEntries(
    Object.entries(dbEntry).filter(([_, v]) => v != null)
  );
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dashboards: {},
  status: "idle",
  error: null,

  fetchDashboards: async () => {
    set({ status: "loading" });
    try {
      const { data, error } = await systemSupabase
        .from("dashboards")
        .select("*");
      if (error) throw error;

      const newData = (data || []).map((item) => DBtoStore(item));
      const dashboardMap = newData.reduce((acc, curr) => {
        acc[curr.id] = curr;
        return acc;
      }, {} as Record<string, Dashboard>);

      set({ dashboards: dashboardMap, status: "succeeded" });
    } catch (err: any) {
      set({ status: "failed", error: err.message });
    }
  },

  getDashboardById: (id) => get().dashboards[id],

  addDashboard: async (name, userId) => {
    const { data, error } = await systemSupabase
      .from("dashboards")
      .insert({
        name,
        user_id: userId,
        config: {},
        config_script: "",
      })
      .select()
      .single();
    if (error) throw error;

    set((state) => ({
      dashboards: { ...state.dashboards, [data.id]: data },
    }));
  },

  deleteDashboard: async (id) => {
    set((state) => {
      const newDashboards = { ...state.dashboards };
      delete newDashboards[id];
      return { dashboards: newDashboards };
    });
    await systemSupabase.from("dashboards").delete().eq("id", id);
  },

  renameDashboard: async (id, name) => {
    set((state) => ({
      dashboards: {
        ...state.dashboards,
        [id]: { ...state.dashboards[id], name },
      },
    }));

    await systemSupabase.from("dashboards").update({ name }).eq("id", id);
  },
  updateDashboard: async (id, updates) => {
    set((state) => ({
      dashboards: {
        ...state.dashboards,
        [id]: { ...state.dashboards[id], ...updates },
      },
    }));

    const { error } = await systemSupabase
      .from("dashboards")
      .update(StoreToDB(updates))
      .eq("id", id);

    if (error) {
      console.error("Error updating dashboard:", error);
    }
  },
}));
