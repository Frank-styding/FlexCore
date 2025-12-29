import { useScriptError } from "@/hooks/useScriptError";
import {
  Context,
  DynamicFunction,
  DynamicValue,
  IComponentData,
} from "@/lib/ComponentBuilders/Component";
import { useEffect, useRef, useState } from "react";

// --- 1. CACHÉ EXTERNA (Sobrevive al desmontaje del componente) ---
// Usamos WeakMap para que si el objeto de configuración se borra de memoria,
// la data cacheada también se borre (evita memory leaks).
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

  // Intentamos recuperar el valor inicial de la caché global si existe
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

  // Ref local para evitar re-ejecuciones durante el Mismo montaje
  const hasExecuted = useRef(false);

  const setValue = (newValue: T) => {
    if (valueRef.current === newValue) return;
    valueRef.current = newValue;
    setStateValue(newValue);
  };

  useEffect(() => {
    let isMounted = true;

    const resolveValue = async () => {
      if (_value === undefined || _value === null) return;

      let source: DynamicValue<T>;
      let shouldKeepData = false;

      // Objeto referencia para usar como clave en el WeakMap
      let cacheKey: object | null = null;

      if (isComponentDataWrapper<DynamicValue<T>>(_value)) {
        source = _value.data;
        shouldKeepData = _value.keepData;
        cacheKey = _value; // Usamos el objeto wrapper como llave única
      } else {
        source = _value as DynamicValue<T>;
      }

      // 2. LÓGICA KEEP DATA MEJORADA:
      // A. Si ya ejecutamos localmente en este montaje, parar.
      if (shouldKeepData && hasExecuted.current) return;

      // B. Si existe en caché GLOBAL y pedimos keepData, usarlo y parar.
      if (shouldKeepData && cacheKey && globalDataCache.has(cacheKey)) {
        const cachedVal = globalDataCache.get(cacheKey);
        setValue(cachedVal);
        hasExecuted.current = true;
        return;
      }

      // 3. Ejecución
      if (typeof source === "function") {
        try {
          const func = source as DynamicFunction<T>;
          const result = await execute<T>(func, context);

          if (isMounted && result !== undefined) {
            setValue(result);
            hasExecuted.current = true;

            // 4. GUARDAR EN CACHÉ GLOBAL
            if (shouldKeepData && cacheKey) {
              globalDataCache.set(cacheKey, result);
            }
          }
        } catch (error) {
          console.error("Error resolving dynamic value:", error);
        }
      } else {
        if (isMounted) {
          setValue(source as T);
          hasExecuted.current = true;
        }
      }
    };

    resolveValue();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_value, context]);

  return [valueRef, setValue, value] as const;
};
