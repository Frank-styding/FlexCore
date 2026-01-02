import { useLayoutEffect } from "react";
import { IContext } from "../modules/types/component.type";

export const useComponentRegistration = <TMethods extends Record<string, any>>(
  context: IContext | undefined,
  group: string,
  id: string,
  methods: TMethods
) => {
  useLayoutEffect(() => {
    if (!context || !id) return;
    const compRegistry = context.comp as any;
    if (!compRegistry) {
      context.comp = {} as any;
    }
    if (!context.comp[group as keyof typeof context.comp]) {
      (context.comp as any)[group] = {};
    }
    (context.comp as any)[group][id] = methods;
    return () => {
      const currentGroup = (context.comp as any)[group];
      if (currentGroup && currentGroup[id]) {
        delete currentGroup[id];
      }
    };
  }, [context, group, id, methods]);
};
