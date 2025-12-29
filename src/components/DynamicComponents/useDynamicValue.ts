import {
  Context,
  DynamicFunction,
  DynamicValue,
} from "@/lib/ComponentBuilders/Component";
import { useEffect, useRef, useState } from "react";

export const useDynamicValue = <T>(
  context: Context,
  _value: DynamicValue<T>,
  defaultValue: T
) => {
  // 1. Estado para la reactividad (renderizado)
  const [value, setStateValue] = useState(defaultValue);

  // 2. Ref para acceso imperativo (getLabel inmediato)
  const valueRef = useRef(defaultValue);

  // 3. Wrapper: Función que actualiza AMBOS al mismo tiempo
  const setValue = (newValue: T) => {
    valueRef.current = newValue; // Actualización inmediata (Síncrona)
    setStateValue(newValue); // Actualización de React (Asíncrona/Batch)
  };

  useEffect(() => {
    let isMounted = true;

    const resolveValue = async () => {
      // Si _value es undefined o null, no hacemos nada o usamos default
      if (_value === undefined) return;

      if (typeof _value === "function") {
        try {
          // Ejecutamos la función (puede ser async o sync)
          const result = await (_value as DynamicFunction<T>)(context);

          if (isMounted) {
            // Usamos nuestro setter personalizado
            setValue(result);
          }
        } catch (error) {
          console.error("Error al resolver valor dinámico:", error);
        }
      } else {
        // Si es un valor estático
        if (isMounted) {
          setValue(_value);
        }
      }
    };

    resolveValue();

    return () => {
      isMounted = false;
    };
  }, [_value, context]); // Agregué 'context' a dependencias por seguridad

  // Retornamos el ref, el setter personalizado y el valor de estado
  // 'as const' ayuda a TypeScript a inferir que es una tupla fija
  return [valueRef, setValue, value] as const;
};
