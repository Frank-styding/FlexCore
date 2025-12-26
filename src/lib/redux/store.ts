import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dashboardSlice from "./features/dashboardSlice";
import pageSlice from "./features/pageSlice";
import scriptEditorSlice from "./features/ScriptEditorSlice";

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session";

const editorPersistConfig = {
  key: "scriptEditor",
  storage: storageSession,
};

const rootReducer = combineReducers({
  dashboards: dashboardSlice,
  pages: pageSlice,
  scriptEditor: persistReducer(editorPersistConfig, scriptEditorSlice),
});

// store.ts

// ... imports anteriores

const rootPersistConfig = {
  key: "root",
  storage: storage,
  // AÑADIMOS 'dashboards' y 'pages' a la blacklist para que no se guarden en localStorage
  // Ahora se guardan en Supabase.
  blacklist: ["scriptEditor", "path", "dashboards", "pages"],
};

// ... el resto del archivo sigue igual
// 4. Reducer Final Persistido
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
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
