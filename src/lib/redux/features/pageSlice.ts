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
  status: "idle",
};

// --- THUNKS ---

// 1. Fetch Pages (Trae todo)
export const fetchPages = createAsyncThunk("pages/fetchPages", async () => {
  const { data, error } = await systemSupabase.from("pages").select("*");
  if (error) throw error;
  return data;
});

// 2. Add Page
export const addPageRemote = createAsyncThunk(
  "pages/addPage",
  async ({
    dashboardId,
    name,
    icon,
    userId,
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
        user_id: userId,
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
    if (payload.updates.name) dbUpdates.name = payload.updates.name;
    if (payload.updates.jsScript !== undefined)
      dbUpdates.js_script = payload.updates.jsScript;
    if (payload.updates.sqlScript !== undefined)
      dbUpdates.sql_script = payload.updates.sqlScript;
    if (payload.updates.isPublic !== undefined) {
      dbUpdates.is_public = payload.updates.isPublic;
    }

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

// 4. Delete Page
export const deletePageRemote = createAsyncThunk(
  "pages/deletePage",
  async (id: string) => {
    const { error } = await systemSupabase.from("pages").delete().eq("id", id);
    if (error) throw error;
    return id;
  }
);

// 5. Fetch Page CONTENT (Específico)
export const fetchPageContent = createAsyncThunk(
  "pages/fetchPageContent",
  async (pageId: string) => {
    const { data, error } = await systemSupabase
      .from("pages")
      .select("id, js_script, sql_script")
      .eq("id", pageId)
      .single();

    if (error) throw error;
    return data;
  }
);
export const fetchPageWithConfig = createAsyncThunk(
  "pages/fetchPageWithConfig",
  async (pageId: string) => {
    const { data, error } = await systemSupabase
      .rpc("get_public_page_details", { p_page_id: pageId })
      .maybeSingle(); // <--- CAMBIO IMPORTANTE: Usar maybeSingle

    if (error) throw error;

    // Si es privada/no existe, data será null. Eso está bien, el hook lo manejará.
    return data;
  }
);

export const pageSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ----------------------------------------------------------------
    // 1. FETCH PAGES (CORREGIDO: MERGE STRATEGY)
    // ----------------------------------------------------------------
    builder.addCase(fetchPages.pending, (state) => {
      state.status = "loading";
    });

    builder.addCase(fetchPages.fulfilled, (state, action) => {
      state.status = "succeeded";

      // Iteramos sobre los datos nuevos
      action.payload.forEach((dbPage: any) => {
        // Buscamos si ya existe una versión en memoria
        const existingPage = state.byId[dbPage.id];

        state.byId[dbPage.id] = {
          id: dbPage.id,
          dashboardId: dbPage.dashboard_id,
          name: dbPage.name,
          icon: dbPage.icon as IconName,
          isPublic: dbPage.is_public,

          // IMPORTANTE:
          // Si ya teníamos scripts cargados y loaded=true, los mantenemos.
          // Si no, usamos lo que viene de la BD.
          jsScript: existingPage?.jsScript ?? dbPage.js_script ?? "",
          sqlScript: existingPage?.sqlScript ?? dbPage.sql_script ?? "",

          // Si fetchPages trae 'select("*")', técnicamente ya está cargado.
          // Pero para estar seguros, si ya estaba loaded, lo dejamos true.
          isLoaded: existingPage?.isLoaded || true,
        };
      });
    });

    builder.addCase(fetchPages.rejected, (state, action) => {
      state.status = "failed";
      console.error("Error fetching pages:", action.error);
    });

    // ----------------------------------------------------------------
    // 2. FETCH PAGE CONTENT (CORREGIDO: SAFETY CHECK)
    // ----------------------------------------------------------------
    builder.addCase(fetchPageContent.fulfilled, (state, action) => {
      const { id, js_script, sql_script } = action.payload;

      // Si la página ya existe en la lista, actualizamos sus scripts y la marcamos loaded
      if (state.byId[id]) {
        state.byId[id].jsScript = js_script;
        state.byId[id].sqlScript = sql_script;
        state.byId[id].isLoaded = true; // <--- ESTA ES LA CLAVE
      }
      // Si por alguna razón extraña llega el contenido antes que la lista (Deep Linking),
      // podríamos crear un entry parcial, pero es raro en tu flujo actual.
    });

    // ----------------------------------------------------------------
    // OTRAS ACCIONES
    // ----------------------------------------------------------------
    builder.addCase(addPageRemote.fulfilled, (state, action) => {
      const dbPage = action.payload;
      state.byId[dbPage.id] = {
        id: dbPage.id,
        dashboardId: dbPage.dashboard_id,
        name: dbPage.name,
        icon: dbPage.icon as IconName,
        jsScript: dbPage.js_script,
        sqlScript: dbPage.sql_script,
        isPublic: dbPage.is_public,
        isLoaded: true, // Una página nueva creada ya tiene sus datos (vacíos) listos
      };
    });

    builder.addCase(updatePageRemote.fulfilled, (state, action) => {
      const dbPage = action.payload;
      if (state.byId[dbPage.id]) {
        state.byId[dbPage.id] = {
          ...state.byId[dbPage.id],
          name: dbPage.name,
          jsScript: dbPage.js_script,
          sqlScript: dbPage.sql_script,
          isPublic: dbPage.is_public,
        };
      }
    });

    builder.addCase(deletePageRemote.fulfilled, (state, action) => {
      delete state.byId[action.payload];
    });

    // Limpieza al borrar dashboard
    builder.addCase(
      "dashboards/deleteDashboard/fulfilled",
      (state, action: any) => {
        const dashboardId = action.payload;
        Object.keys(state.byId).forEach((pageId) => {
          if (state.byId[pageId].dashboardId === dashboardId) {
            delete state.byId[pageId];
          }
        });
      }
    );
  },
});

export const {} = pageSlice.actions;
export default pageSlice.reducer;
