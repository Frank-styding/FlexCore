/* eslint-disable react-hooks/immutability */
import { Context } from "@/lib/ComponentBuilders/Component";
import { useEffect } from "react";

export const useComponentRegistration = <TMethods extends Record<string, any>>(
  context: Context | undefined,
  group: string,
  id: string,
  methods: TMethods
) => {
  useEffect(() => {
    if (!context || !id) return;

    // 1. Asegurar estructura (Defensive Programming)
    // Usamos 'any' para permitir acceso dinámico a claves como 'btn', 'input', etc.
    const compRegistry = context.comp as any;

    if (!compRegistry) {
      context.comp = {} as any;
    }

    if (!context.comp[group as keyof typeof context.comp]) {
      (context.comp as any)[group] = {};
    }

    // 2. Registrar los métodos
    // Al asignar methods directamente, mantenemos la referencia actualizada.
    (context.comp as any)[group][id] = methods;

    // 3. Cleanup: Eliminar del contexto al desmontar
    return () => {
      const currentGroup = (context.comp as any)[group];
      if (currentGroup && currentGroup[id]) {
        delete currentGroup[id];
      }
    };
  }, [context, group, id, methods]);
};
