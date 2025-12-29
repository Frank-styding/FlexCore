import { configureStore } from "@reduxjs/toolkit";
import dashboardSlice from "./features/dashboardSlice";
import pageSlice from "./features/pageSlice";
import scriptEditorSlice from "./features/ScriptEditorSlice";
import DBConnectionSlice from "./features/ConnectionSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      dashboards: dashboardSlice,
      pages: pageSlice,
      scriptEditor: scriptEditorSlice,
      DBConnection: DBConnectionSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Solo ignoramos la acción específica de tu editor si devuelve datos complejos
          // Eliminamos FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
          ignoredActions: ["scriptEditor/execute/fulfilled"],
        },
      }),
  });
};

// Exportar tipos inferidos
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
