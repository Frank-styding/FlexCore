import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dashboardSlice from "./features/dashboardSlice";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage"; // Por defecto usa localStorage
import storageSession from "redux-persist/lib/storage/session";
import pathSlice from "./features/pathSlice";

/* // 1. Configuración de la persistencia
const persistConfig = {
  key: "root", // La clave principal en localStorage
  storage, // El motor de almacenamiento (localStorage)
  whitelist: ["dashboard"],
}; */

// 1. Configuración para el slice que quieres que sea TEMPORAL (Session)
const dashboardPersistConfig = {
  key: "path",
  storage: storageSession,
};

// 2. Configuración Raíz por defecto (LocalStorage)
const rootPersistConfig = {
  key: "root",
  storage: storage, // Por defecto todo va al disco duro
  // ⚠️ CRUCIAL: Bloqueamos 'dashboard' aquí porque ya tiene su propia configuración abajo
  blacklist: ["path"],
};

// 2. Combinar reducers (necesario para persistReducer)
const rootReducer = combineReducers({
  dashboard: dashboardSlice,
  path: persistReducer(dashboardPersistConfig, pathSlice),
});

// 3. Crear el reducer persistido
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer, // Usamos el reducer persistido
    // 4. Configurar middleware para ignorar advertencias de serialización de redux-persist
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
