// lib/features/dashboardSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  names: string[];
}

const initialState: DashboardState = {
  names: [],
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Usa PayloadAction para que TS sepa qué dato recibes
    addDashboard: (state, action: PayloadAction<string>) => {
      // Nota: El segundo argumento es la 'action', y dentro está el 'payload'
      state.names.push(action.payload);
    },
    deleteDashboard: (state, action: PayloadAction<string>) => {
      state.names = state.names.filter((item) => item !== action.payload);
    },
  },
});

// 1. Exporta las acciones para usarlas en tus componentes
export const { addDashboard, deleteDashboard } = dashboardSlice.actions;

// 2. Exporta el reducer por defecto para el store
export default dashboardSlice.reducer;
