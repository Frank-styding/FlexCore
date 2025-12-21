/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/redux/store";

interface RouteEntry {
  path: string;
  data: any | null;
}

interface PathStore {
  history: RouteEntry[];
  currentIndex: number;
}

const initialState: PathStore = {
  history: [],
  currentIndex: -1,
};

export const pathSlice = createSlice({
  name: "path",
  initialState,
  reducers: {
    // 1. Navegación Manual (Push)
    pushRoute: (state, action: PayloadAction<{ path: string; data?: any }>) => {
      const { path, data = null } = action.payload;

      // Si la ruta a la que vamos es IGUAL a la actual, solo actualizamos la data y no creamos historial
      // Esto evita duplicados si el usuario hace clic 2 veces en el mismo link
      if (
        state.currentIndex !== -1 &&
        state.history[state.currentIndex].path === path
      ) {
        state.history[state.currentIndex].data = data;
        return;
      }

      const newHistory = state.history.slice(0, state.currentIndex + 1);
      newHistory.push({ path, data });
      state.history = newHistory;
      state.currentIndex = newHistory.length - 1;
    },

    // 2. Sincronización Automática (Browser -> Redux)
    syncExternalRoute: (state, action: PayloadAction<string>) => {
      const path = action.payload;

      // Si el historial está vacío, inicializamos
      if (state.currentIndex === -1) {
        state.history.push({ path, data: null });
        state.currentIndex = 0;
        return;
      }

      const currentEntry = state.history[state.currentIndex];

      // A. Evitar bucles si ya estamos ahí
      if (currentEntry && currentEntry.path === path) return;

      // B. BÚSQUEDA HACIA ATRÁS (Back)
      // Buscamos desde el índice actual hacia el principio (0)
      // Esto arregla el problema: si el usuario salta o hay un desajuste, lo encontramos igual.
      for (let i = state.currentIndex - 1; i >= 0; i--) {
        if (state.history[i].path === path) {
          state.currentIndex = i; // Restauramos el índice antiguo (que tiene la DATA)
          return;
        }
      }

      // C. BÚSQUEDA HACIA ADELANTE (Forward)
      // Buscamos desde el índice actual hacia el final
      for (let i = state.currentIndex + 1; i < state.history.length; i++) {
        if (state.history[i].path === path) {
          state.currentIndex = i; // Restauramos el índice futuro (que tiene la DATA)
          return;
        }
      }

      // D. Ruta Nueva Real (Solo si no existe en el historial cercano)
      // Aquí es donde se pierde la data, así que solo llegamos aquí si realmente es una ruta nueva
      state.history.push({ path, data: null });
      state.currentIndex = state.history.length - 1;
    },
  },
});

export const { pushRoute, syncExternalRoute } = pathSlice.actions;

export const selectCurrentRouteData = (state: RootState) => {
  const { history, currentIndex } = state.path;
  if (currentIndex >= 0 && history[currentIndex]) {
    return history[currentIndex].data;
  }
  return null;
};

export default pathSlice.reducer;
