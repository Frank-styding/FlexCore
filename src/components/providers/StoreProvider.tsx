"use client";
import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/lib/redux/store";
// 1. Nuevas importaciones necesarias
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 2. Creamos el store una única vez
  const [store] = useState(() => makeStore());

  // 3. Creamos el 'persistor' ligado a ese store una única vez
  // Esto se encarga de vigilar el store y guardar cambios en localStorage
  const [persistor] = useState(() => persistStore(store));

  return (
    <Provider store={store}>
      {/* 4. Envolvemos la app en PersistGate */}
      {/* 'loading' es lo que se muestra mientras se recuperan los datos (puede ser un spinner o null) */}
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
