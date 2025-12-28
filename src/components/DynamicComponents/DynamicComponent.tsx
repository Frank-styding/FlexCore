import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { COMPONENTS } from "./Components";
import { ReactNode, memo } from "react";

// OPTIMIZACIÓN: Memoizar el componente recursivo
export const DynamicComponent = memo(
  ({ data, context }: { data?: Component; context?: Context }) => {
    if (!data) return null;

    const TargetComponent = COMPONENTS[data.type] as
      | (({}: any) => ReactNode)
      | undefined;

    if (!TargetComponent) return null;

    return (
      <TargetComponent {...data} context={context}>
        {data.subComponents &&
          (Array.isArray(data.subComponents) ? (
            data.subComponents.map((item) => (
              <DynamicComponent data={item} key={item.id} context={context} />
            ))
          ) : (
            <DynamicComponent data={data.subComponents} context={context} />
          ))}
      </TargetComponent>
    );
  }
);

DynamicComponent.displayName = "DynamicComponent";
