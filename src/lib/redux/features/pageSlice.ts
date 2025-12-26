import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Page } from "@/types/types";
import { systemSupabase } from "@/lib/supabase/client";
import { IconName } from "@/components/custom/DynamicIcon";

interface PageState {
  byId: Record<string, Page & { isLoaded?: boolean }>;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: PageState = {
  byId: {},
  /*   activePage: null, */
  status: "idle",
};

// --- THUNKS ---

// 1. Fetch Pages
export const fetchPages = createAsyncThunk("pages/fetchPages", async () => {
  // Supabase filtrará automáticamente por user_id si tienes RLS activado
  const { data, error } = await systemSupabase.from("pages").select("*");
  if (error) throw error;
  return data;
});

// 2. Add Page (ACTUALIZADO para incluir user_id)
export const addPageRemote = createAsyncThunk(
  "pages/addPage",
  async ({
    dashboardId,
    name,
    icon,
    userId, // <--- NUEVO PARAMETRO REQUERIDO
  }: {
    dashboardId: string;
    name: string;
    icon: IconName;
    userId: string;
  }) => {
    const { data, error } = await systemSupabase
      .from("pages")
      .insert({
        dashboard_id: dashboardId,
        user_id: userId, // <--- Mapeo a la nueva columna de la BD
        name,
        icon,
        js_script: "",
        sql_script: "",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

// 3. Update Page
export const updatePageRemote = createAsyncThunk(
  "pages/updatePage",
  async (payload: { id: string; updates: Partial<Page> }) => {
    const dbUpdates: any = {};

    // Mapeo de camelCase (Frontend) a snake_case (Base de Datos)
    if (payload.updates.name) dbUpdates.name = payload.updates.name;
    if (payload.updates.jsScript !== undefined)
      dbUpdates.js_script = payload.updates.jsScript;
    if (payload.updates.sqlScript !== undefined)
      dbUpdates.sql_script = payload.updates.sqlScript;
    // Nota: No actualizamos dashboard_id ni user_id usualmente en un update simple

    const { data, error } = await systemSupabase
      .from("pages")
      .update(dbUpdates)
      .eq("id", payload.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);
// 1. Fetch Pages LIST (LIGERO - Solo metadatos para el Sidebar)
export const fetchPagesList = createAsyncThunk(
  "pages/fetchPagesList",
  async (userId?: string) => {
    let query = systemSupabase
      .from("pages")
      // IMPORTANTE: NO pedimos js_script ni sql_script aquí
      .select("id, name, icon, dashboard_id, user_id");

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
);

// 2. Fetch Page CONTENT (PESADO - Solo cuando se selecciona la página)
export const fetchPageContent = createAsyncThunk(
  "pages/fetchPageContent",
  async (pageId: string) => {
    const { data, error } = await systemSupabase
      .from("pages")
      .select("id, js_script, sql_script") // Solo traemos los scripts
      .eq("id", pageId)
      .single();

    if (error) throw error;
    return data;
  }
);

// 4. Delete Page
export const deletePageRemote = createAsyncThunk(
  "pages/deletePage",
  async (id: string) => {
    const { error } = await systemSupabase.from("pages").delete().eq("id", id);
    if (error) throw error;
    return id;
  }
);

export const pageSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    /*     selectPage: (state, action: PayloadAction<{ id: string }>) => {
      state.activePage = action.payload.id;
    }, */
  },
  extraReducers: (builder) => {
    // ----------------------------------------------------------------
    // 1. FETCH PAGES (Manejo completo de estado)
    // ----------------------------------------------------------------

    // CASO PENDING (Cargando)
    builder.addCase(fetchPages.pending, (state) => {
      state.status = "loading";
    });

    // CASO FULFILLED (Éxito)
    builder.addCase(fetchPages.fulfilled, (state, action) => {
      state.status = "succeeded"; // <--- ACTUALIZAR AQUÍ

      const pagesMap: Record<string, Page> = {};
      action.payload.forEach((dbPage: any) => {
        pagesMap[dbPage.id] = {
          id: dbPage.id,
          dashboardId: dbPage.dashboard_id,
          name: dbPage.name,
          icon: dbPage.icon as IconName,
          jsScript: dbPage.js_script,
          sqlScript: dbPage.sql_script,
        };
      });
      state.byId = pagesMap;
    });

    // CASO REJECTED (Error)
    builder.addCase(fetchPages.rejected, (state, action) => {
      state.status = "failed";
      console.error("Error fetching pages:", action.error);
    });

    // ----------------------------------------------------------------
    // OTRAS ACCIONES (Add, Update, Delete)
    // ----------------------------------------------------------------
    // Nota: Usualmente para estas acciones no cambiamos el 'status' global
    // a "loading" para no mostrar un spinner de carga completa,
    // pero si quisieras bloquear la UI, deberías agregar sus .pending y .rejected también.

    builder.addCase(addPageRemote.fulfilled, (state, action) => {
      // Opcional: state.status = "succeeded";
      const dbPage = action.payload;
      state.byId[dbPage.id] = {
        id: dbPage.id,
        dashboardId: dbPage.dashboard_id,
        name: dbPage.name,
        icon: dbPage.icon as IconName,
        jsScript: dbPage.js_script,
        sqlScript: dbPage.sql_script,
      };
      /*       state.activePage = dbPage.id; */
    });

    builder.addCase(updatePageRemote.fulfilled, (state, action) => {
      const dbPage = action.payload;
      if (state.byId[dbPage.id]) {
        state.byId[dbPage.id] = {
          ...state.byId[dbPage.id],
          name: dbPage.name,
          jsScript: dbPage.js_script,
          sqlScript: dbPage.sql_script,
        };
      }
    });

    builder.addCase(deletePageRemote.fulfilled, (state, action) => {
      delete state.byId[action.payload];
      /*       if (state.activePage === action.payload) state.activePage = null; */
    });
    builder.addCase(fetchPageContent.fulfilled, (state, action) => {
      const { id, js_script, sql_script } = action.payload;
      if (state.byId[id]) {
        state.byId[id].jsScript = js_script;
        state.byId[id].sqlScript = sql_script;
        state.byId[id].isLoaded = true; // Marcamos como completo
      }
    });
    builder.addCase(
      "dashboards/deleteDashboard/fulfilled",
      (state, action: any) => {
        const dashboardId = action.payload;
        Object.keys(state.byId).forEach((pageId) => {
          if (state.byId[pageId].dashboardId === dashboardId) {
            delete state.byId[pageId];
          }
        });
        /*         if (state.activePage && !state.byId[state.activePage]) {
          state.activePage = null;
        } */
      }
    );
  },
});

export const {} = pageSlice.actions;
export default pageSlice.reducer;
