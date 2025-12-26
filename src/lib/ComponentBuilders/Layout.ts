import { Component, Context } from "./Component";

type LayoutConfig = {
  className?: string;
};

type Layout = (
  data: { id: string; config: LayoutConfig; context?: Context },
  subComponents: Component[]
) => Component;

export const Layout: Layout = (
  { id, config, context },
  subComponents: Component[]
) => {
  return {
    id,
    type: "Layout",
    config,
    context,
    events: {},
    buildFuncs: {},
    subComponents,
  };
};

export const LayoutType = `
type LayoutConfig = {
  className?: string;
};

type Layout = (
  data: { id: string; config: LayoutConfig, context?:Context },
  subComponents: Component[]
) => Component;

declare const Layout:Layout;
`;
