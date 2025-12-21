/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  pushRoute,
  syncExternalRoute,
  selectCurrentRouteData,
} from "@/lib/redux/features/pathSlice";

export function useRouterSync<T = any>() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // 1. Obtener la DATA automáticamente del store
  // Usamos el genérico <T> por si quieres tipar la data que recibes
  const data = useAppSelector(selectCurrentRouteData) as T | null;

  // 2. Efecto de Sincronización (Browser -> Redux)
  // Escucha cambios en la URL (incluyendo botón Atrás/Adelante)
  useEffect(() => {
    const fullPath =
      searchParams.size > 0
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

    dispatch(syncExternalRoute(fullPath));
  }, [pathname, searchParams, dispatch]);

  // 3. Función Navegar (Tu App -> Redux -> Browser)
  const navigate = (path: string, pageData?: T) => {
    // Primero guardamos en Redux para tener la data lista
    dispatch(pushRoute({ path, data: pageData }));
    // Luego movemos el navegador
    router.push(path);
  };

  // 4. Función Volver
  const back = () => {
    // Solo decimos al navegador que vuelva.
    // El useEffect de arriba detectará el cambio de URL y actualizará Redux.
    router.back();
  };

  return {
    navigate, // Para ir a otra página con datos
    back, // Para volver (recuperando los datos anteriores)
    data, // Los datos de la página actual
    pathname, // La ruta actual (por si la necesitas)
  };
}
