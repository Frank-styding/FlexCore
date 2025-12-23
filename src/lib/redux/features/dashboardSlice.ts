// lib/features/dashboardSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addPage, deletePage } from "./pageSlice";
import { v4 as uuid } from "uuid";
import { Dashboard } from "@/types/types";

interface DashboardState {
  byId: Record<string, Dashboard>;
  activeDashboardId: string | null;
}

const initialState: DashboardState = {
  byId: {},
  activeDashboardId: null,
};

export const dashboardSlice = createSlice({
  name: "dashboards",
  initialState,
  reducers: {
    addDashboard: (state, action: PayloadAction<{ name: string }>) => {
      const id = uuid();
      const { name } = action.payload;
      state.byId[id] = {
        id,
        name,
        pageIds: [],
      };
    },
    deleteDashboard: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      delete state.byId[id];
    },
    renameDashboard: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const { id, name } = action.payload;
      state.byId[id].name = name;
    },
    selectDashboard: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      state.activeDashboardId = id;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addPage, (state, action) => {
      const { dashboardId, id } = action.payload;
      const dashboard = state.byId[dashboardId];
      if (dashboard) {
        dashboard.pageIds.push(id as string);
      }
    });

    builder.addCase(deletePage, (state, action) => {
      const { dashboardId, id } = action.payload;
      const dashboard = state.byId[dashboardId];
      if (dashboard) {
        dashboard.pageIds = dashboard.pageIds.filter((i) => i != id);
      }
    });
  },
});

export const {
  addDashboard,
  renameDashboard,
  deleteDashboard,
  selectDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
