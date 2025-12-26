import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Dashboard } from "@/types/types";
import { systemSupabase } from "@/lib/supabase/client"; // Tu cliente supabase

interface DashboardState {
  byId: Record<string, Dashboard>;
  /*   activeDashboardId: string | null; */
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: DashboardState = {
  byId: {},
  /*   activeDashboardId: null, */
  status: "idle",
};

// --- THUNKS (Acciones Asíncronas) ---

// 1. Fetch Dashboards
export const fetchDashboards = createAsyncThunk(
  "dashboards/fetchDashboards",
  async () => {
    const { data, error } = await systemSupabase.from("dashboards").select("*");

    if (error) throw error;
    return data;
  }
);

// 2. Add Dashboard
export const addDashboardRemote = createAsyncThunk(
  "dashboards/addDashboard",
  async ({ name, userId }: { name: string; userId: string }) => {
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
    return data;
  }
);

// 3. Update Dashboard (Config o Nombre)
export const updateDashboardRemote = createAsyncThunk(
  "dashboards/updateDashboard",
  async (payload: { id: string; updates: Partial<Dashboard> }) => {
    // Mapeamos camelCase a snake_case para la BD
    const dbUpdates: any = {};
    if (payload.updates.name) dbUpdates.name = payload.updates.name;
    if (payload.updates.config) dbUpdates.config = payload.updates.config;
    if (payload.updates.configScript)
      dbUpdates.config_script = payload.updates.configScript;

    const { data, error } = await systemSupabase
      .from("dashboards")
      .update(dbUpdates)
      .eq("id", payload.id)
      .select()
      .single();

    if (error) throw error;
    return data; // Retorna el objeto actualizado de la DB
  }
);

// 4. Delete Dashboard
export const deleteDashboardRemote = createAsyncThunk(
  "dashboards/deleteDashboard",
  async (id: string) => {
    const { error } = await systemSupabase
      .from("dashboards")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return id;
  }
);

export const dashboardSlice = createSlice({
  name: "dashboards",
  initialState,
  reducers: {
    /*     selectDashboard: (state, action: PayloadAction<{ id: string }>) => {
      state.activeDashboardId = action.payload.id;
    }, */
  },
  extraReducers: (builder) => {
    // --- Fetch Handlers ---
    builder.addCase(fetchDashboards.fulfilled, (state, action) => {
      state.status = "succeeded";
      // Convertir array de DB a Objeto byId y mapear campos
      const dashboardsMap: Record<string, Dashboard> = {};
      action.payload.forEach((dbDash: any) => {
        dashboardsMap[dbDash.id] = {
          id: dbDash.id,
          name: dbDash.name,
          config: dbDash.config,
          configScript: dbDash.config_script, // Snake a Camel
          pageIds: [], // Se llenará dinámicamente o se infiere
        };
      });
      state.byId = dashboardsMap;
    });

    // --- Add Handlers ---
    builder.addCase(addDashboardRemote.fulfilled, (state, action) => {
      const dbDash = action.payload;
      state.byId[dbDash.id] = {
        id: dbDash.id,
        name: dbDash.name,
        config: dbDash.config,
        configScript: dbDash.config_script,
        pageIds: [],
      };
      /*       // Opcional: Seleccionar el nuevo dashboard
      state.activeDashboardId = dbDash.id; */
    });

    // --- Update Handlers ---
    builder.addCase(updateDashboardRemote.fulfilled, (state, action) => {
      const dbDash = action.payload;
      if (state.byId[dbDash.id]) {
        state.byId[dbDash.id] = {
          ...state.byId[dbDash.id],
          name: dbDash.name,
          config: dbDash.config,
          configScript: dbDash.config_script,
        };
      }
    });

    // --- Delete Handlers ---
    builder.addCase(deleteDashboardRemote.fulfilled, (state, action) => {
      delete state.byId[action.payload];
      /*       if (state.activeDashboardId === action.payload) {
        state.activeDashboardId = null;
      } */
    });
  },
});

export const {} = dashboardSlice.actions;
export default dashboardSlice.reducer;
