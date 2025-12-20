import { configureStore } from "@reduxjs/toolkit";
import dashboardSlice from "./features/dashboard";

export const makeStore = () => {
  return configureStore({
    reducer: { dashboard: dashboardSlice },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
