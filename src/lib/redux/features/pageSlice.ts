import { IconName } from "@/components/custom/DynamicIcon";
import { Page } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

interface PageState {
  byId: Record<string, Page>;
  activePage: string | null;
}

const initialState: PageState = {
  byId: {},
  activePage: null,
};

export const pageSlice = createSlice({
  name: "pages",
  initialState,
  reducers: {
    addPage: {
      reducer: (
        state,
        action: PayloadAction<{
          dashboardId: string;
          id: string;
          page: {
            name: string;
            icon: IconName;
          };
        }>
      ) => {
        const { page, id, dashboardId } = action.payload;
        state.byId[id] = {
          ...page,
          id,
          dashboardId,
          sqlScript: "",
          jsScript: "",
        };
      },
      prepare: ({
        dashboardId,
        page,
      }: {
        dashboardId: string;
        page: { name: string; icon: IconName };
      }) => {
        const id = uuid();
        return {
          payload: {
            id,
            dashboardId,
            page,
          },
        };
      },
    },
    deletePage: (
      state,
      action: PayloadAction<{ dashboardId: string; id: string }>
    ) => {
      const { id } = action.payload;
      delete state.byId[id];
    },
    renamePage: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const { id, name } = action.payload;
      state.byId[id].name = name;
    },

    selectPage: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.activePage = id;
    },
    updatePageScript: (
      state,
      action: PayloadAction<{ id: string; js?: string; sql?: string }>
    ) => {
      const { id, js, sql } = action.payload;
      const page = state.byId[id];

      if (page) {
        if (js !== undefined) page.jsScript = js; // Asumiendo que tu propiedad se llama jsScript
        if (sql !== undefined) page.sqlScript = sql; // Asumiendo que tu propiedad se llama sqlScript
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase("dashboards/deleteDashboard", (state, action: any) => {
      const dashboardIdToDelete = action.payload.id;

      // Recorremos todas las páginas y borramos las que pertenezcan a ese dashboard
      Object.keys(state.byId).forEach((pageId) => {
        const page = state.byId[pageId];
        if (page.dashboardId === dashboardIdToDelete) {
          delete state.byId[pageId];
        }
      });

      // Opcional: Si la página activa era de ese dashboard, resetear activePage
      if (state.activePage && !state.byId[state.activePage]) {
        state.activePage = null;
      }
    });
  },
});

export const { addPage, deletePage, renamePage, selectPage, updatePageScript } =
  pageSlice.actions;

export default pageSlice.reducer;
