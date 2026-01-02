import { useEffect, useRef, useState, useCallback } from "react";
import { useScriptError } from "./useConnectionError";
import {
  IComponentData,
  IContext,
  IDynamicFunction,
  IDynamicValue,
} from "../modules/types/component.type";

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
  context: IContext,
  _value: IComponentData<T> | undefined,
  defaultValue: T
) => {
  const execute = useScriptError();
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

  const [reloadVersion, setReloadVersion] = useState(0);
  const ignoreCacheOnce = useRef(false);

  const setValue = (newValue: T) => {
    if (valueRef.current === newValue) return;
    valueRef.current = newValue;
    setStateValue(newValue);
  };

  const reload = useCallback(() => {
    ignoreCacheOnce.current = true;
    hasExecuted.current = false;
    setReloadVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const resolveValue = async () => {
      if (_value === undefined || _value === null) return;

      let source: IDynamicValue<T>;
      let shouldKeepData = false;
      let cacheKey: object | null = null;

      if (isComponentDataWrapper<IDynamicValue<T>>(_value)) {
        source = _value.data;
        shouldKeepData = _value.keepData;
        cacheKey = _value;
      } else {
        source = _value as IDynamicValue<T>;
      }
      if (shouldKeepData && hasExecuted.current && !ignoreCacheOnce.current) {
        return;
      }
      if (
        shouldKeepData &&
        cacheKey &&
        globalDataCache.has(cacheKey) &&
        !ignoreCacheOnce.current
      ) {
        const cachedVal = globalDataCache.get(cacheKey);
        setValue(cachedVal);
        hasExecuted.current = true;
        return;
      }

      if (typeof source === "function") {
        try {
          const func = source as IDynamicFunction<T>;
          const result = await execute<T>(func, context);

          if (isMounted && result !== undefined) {
            setValue(result);
            hasExecuted.current = true;
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
      if (ignoreCacheOnce.current) {
        ignoreCacheOnce.current = false;
      }
    };

    resolveValue();

    return () => {
      isMounted = false;
    };
  }, [_value, context, reloadVersion]);
  return [valueRef, setValue, value, reload] as const;
};
