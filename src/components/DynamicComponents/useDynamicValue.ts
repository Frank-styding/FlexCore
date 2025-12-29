import { useScriptError } from "@/hooks/useScriptError";
import {
  Context,
  DynamicFunction,
  DynamicValue,
  IComponentData,
} from "@/lib/ComponentBuilders/Component";
import { useEffect, useRef, useState, useCallback } from "react";

// Cache Global (WeakMap)
const globalDataCache = new WeakMap<object, any>();

function isComponentDataWrapper<T>(
  value: any
): value is { data: T; keepData: boolean } {
  return (
    value !== null &&
    typeof value === "object" &&
    "data" in value &&
    "keepData" in value
  );
}

export const useDynamicValue = <T>(
  context: Context,
  _value: IComponentData<DynamicValue<T>> | undefined,
  defaultValue: T
) => {
  const execute = useScriptError();

  // Función interna para leer caché inicial síncronamente
  const getInitialValue = (): T => {
    if (
      _value &&
      isComponentDataWrapper(_value) &&
      _value.keepData &&
      globalDataCache.has(_value)
    ) {
      return globalDataCache.get(_value) as T;
    }
    return defaultValue;
  };

  const [value, setStateValue] = useState<T>(getInitialValue);
  const valueRef = useRef<T>(getInitialValue());
  const hasExecuted = useRef(false);

  // --- NUEVO: Control de Recarga ---
  const [reloadVersion, setReloadVersion] = useState(0); // Disparador del Effect
  const ignoreCacheOnce = useRef(false); // Flag para saltar caché

  const setValue = (newValue: T) => {
    if (valueRef.current === newValue) return;
    valueRef.current = newValue;
    setStateValue(newValue);
  };

  // Esta es la función que devolveremos al componente
  const reload = useCallback(() => {
    ignoreCacheOnce.current = true; // 1. Orden: Ignorar caché en la próxima vuelta
    hasExecuted.current = false; // 2. Orden: Permitir ejecución local
    setReloadVersion((v) => v + 1); // 3. Disparar: Ejecutar Effect
  }, []);

  useEffect(() => {
    let isMounted = true;

    const resolveValue = async () => {
      if (_value === undefined || _value === null) return;

      let source: DynamicValue<T>;
      let shouldKeepData = false;
      let cacheKey: object | null = null;

      if (isComponentDataWrapper<DynamicValue<T>>(_value)) {
        source = _value.data;
        shouldKeepData = _value.keepData;
        cacheKey = _value;
      } else {
        source = _value as DynamicValue<T>;
      }

      // --- LÓGICA DE CACHÉ ACTUALIZADA ---

      // A. Si ya se ejecutó en este montaje Y NO se pidió recargar, salir.
      if (shouldKeepData && hasExecuted.current && !ignoreCacheOnce.current) {
        return;
      }

      // B. Revisar caché global (SOLO SI ignoreCacheOnce ES FALSO)
      if (
        shouldKeepData &&
        cacheKey &&
        globalDataCache.has(cacheKey) &&
        !ignoreCacheOnce.current // <--- Aquí está la clave
      ) {
        const cachedVal = globalDataCache.get(cacheKey);
        setValue(cachedVal);
        hasExecuted.current = true;
        return;
      }

      // 3. Ejecución Real (Fetching)
      if (typeof source === "function") {
        try {
          const func = source as DynamicFunction<T>;
          const result = await execute<T>(func, context);

          if (isMounted && result !== undefined) {
            setValue(result);
            hasExecuted.current = true;

            // Guardar en caché global
            if (shouldKeepData && cacheKey) {
              globalDataCache.set(cacheKey, result);
            }
          }
        } catch (error) {
          console.error("Error resolving dynamic value:", error);
        }
      } else {
        // Valor estático
        if (isMounted) {
          setValue(source as T);
          hasExecuted.current = true;
        }
      }

      // Limpiamos el flag de forzar recarga después de intentar resolver
      if (ignoreCacheOnce.current) {
        ignoreCacheOnce.current = false;
      }
    };

    resolveValue();

    return () => {
      isMounted = false;
    };
    // Agregamos reloadVersion a las dependencias para que el effect corra al cambiarlo
  }, [_value, context, reloadVersion]);

  // Retornamos 4 valores: ref, setter manual, valor estado, y función reload
  return [valueRef, setValue, value, reload] as const;
};
