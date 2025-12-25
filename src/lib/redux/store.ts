import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dashboardSlice from "./features/dashboardSlice";
import pageSlice from "./features/pageSlice";
import scriptEditorSlice from "./features/ScriptEditorSlice";

import {
  persistReducer,
  persistStore, // Necesitarás esto en tu layout/provider
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage"; // LocalStorage (Disco)
import storageSession from "redux-persist/lib/storage/session"; // SessionStorage (Pestaña)

// 1. Configuración para el editor (SessionStorage)
// Esto es ideal: si cierra la pestaña, se limpia el editor, pero no el dashboard
const editorPersistConfig = {
  key: "scriptEditor",
  storage: storageSession,
  // Opcional: blacklist: ['logs'] si no quieres guardar logs
};

// 2. Reducer Raíz Combinado
const rootReducer = combineReducers({
  dashboards: dashboardSlice,
  pages: pageSlice,
  // Aplicamos persistencia específica al editor
  scriptEditor: persistReducer(editorPersistConfig, scriptEditorSlice),
});

// 3. Configuración Raíz (LocalStorage)
const rootPersistConfig = {
  key: "root",
  storage: storage,
  // IMPORTANTE: Bloqueamos 'scriptEditor' aquí porque ya lo configuramos arriba
  // Si no lo haces, storage (local) sobrescribirá storageSession
  blacklist: ["scriptEditor"],
};

// 4. Reducer Final Persistido
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignoramos acciones de redux-persist para evitar warnings
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            "scriptEditor/execute/fulfilled",
          ],
        },
      }),
  });
};

// Exportar tipos
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
