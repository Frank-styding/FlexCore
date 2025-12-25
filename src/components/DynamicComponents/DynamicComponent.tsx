import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { COMPONENTS } from "./Components";
import { ReactNode } from "react";

const defaultContext: Context = {
  comp: {},
};

export const DynamicComponent = ({
  data,
  context = defaultContext,
}: {
  data?: Component;
  context?: Context;
}) => {
  if (!data) return null;

  const Component = COMPONENTS[data.type] as
    | (({}: any) => ReactNode)
    | undefined;

  if (!Component) return null;

  return (
    <Component {...data} context={context}>
      {data.subComponents &&
        (Array.isArray(data.subComponents) ? (
          data.subComponents.map((item) => (
            <DynamicComponent data={item} key={item.id} context={context} />
          ))
        ) : (
          <DynamicComponent data={data.subComponents} context={context} />
        ))}
    </Component>
  );
};
