/* eslint-disable react-hooks/refs */
"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/lib/redux/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Usamos useRef para mantener la instancia del store a través de re-renders
  // sin disparar nuevos renderizados cuando se crea.
  const storeRef = useRef<AppStore>(undefined);

  if (!storeRef.current) {
    // Crea la instancia del store la primera vez que se renderiza este componente
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
