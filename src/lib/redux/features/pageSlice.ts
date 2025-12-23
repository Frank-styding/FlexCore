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
          component: null,
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

export const { addPage, deletePage, renamePage } = pageSlice.actions;

export default pageSlice.reducer;
