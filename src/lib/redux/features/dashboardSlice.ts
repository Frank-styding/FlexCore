/* eslint-disable @typescript-eslint/no-empty-object-type */
// lib/features/dashboardSlice.ts
import { IconName } from "@/components/custom/DynamicIcon";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

interface DashboadData {
  id: string;
  name: string;
  pages: { icon: IconName; name: string; id: string }[];
}

interface DashboardState {
  dashboards: DashboadData[];
}

const initialState: DashboardState = {
  dashboards: [],
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Usa PayloadAction para que TS sepa qué dato recibes
    addDashboard: (state, action: PayloadAction<{ name: string }>) => {
      const { name } = action.payload;
      const id = uuid();
      state.dashboards.push({
        id,
        name,
        pages: [],
      });
    },

    deleteDashboard: (state, action: PayloadAction<{ id: string }>) => {
      state.dashboards = state.dashboards.filter(
        (item) => item.id !== action.payload.id
      );
    },

    editDashboard: (
      state,
      action: PayloadAction<{ dashboardId: string; name: string }>
    ) => {
      const { dashboardId, name } = action.payload;
      const idx = state.dashboards.findIndex((item) => item.id == dashboardId);
      if (idx == -1) return;
      state.dashboards[idx].name = name;
    },

    addPage: (
      state,
      action: PayloadAction<{
        dashboardId: string;
        page: { icon: IconName; name: string };
      }>
    ) => {
      const { dashboardId, page } = action.payload;
      const idx = state.dashboards.findIndex((item) => item.id == dashboardId);

      if (idx == -1) return;

      if (state.dashboards[idx].pages.some((item) => item.name == page.name))
        return;

      state.dashboards[idx].pages.push({ ...page, id: uuid() });
    },

    deletePage: (
      state,
      action: PayloadAction<{
        dashboardId: string;
        page: { id: string };
      }>
    ) => {
      const { dashboardId, page } = action.payload;
      const idx = state.dashboards.findIndex((item) => item.id == dashboardId);
      if (idx == -1) return;
      state.dashboards[idx].pages = state.dashboards[idx].pages.filter(
        (name) => name.id != page.id
      );
    },
    updatePage: (
      state,
      action: PayloadAction<{
        dashboardId: string;
        page: { id: string; name: string };
      }>
    ) => {
      const { dashboardId, page } = action.payload;
      const idx = state.dashboards.findIndex((item) => item.id == dashboardId);
      if (idx == -1) return;
      const idxPage = state.dashboards[idx].pages.findIndex(
        (item) => item.id == page.id
      );
      if (idxPage == -1) return;

      state.dashboards[idx].pages[idxPage].name = page.name;
    },
  },
});

// 1. Exporta las acciones para usarlas en tus componentes
export const {
  addDashboard,
  editDashboard,
  deleteDashboard,
  addPage,
  deletePage,
  updatePage,
} = dashboardSlice.actions;

// 2. Exporta el reducer por defecto para el store
export default dashboardSlice.reducer;
