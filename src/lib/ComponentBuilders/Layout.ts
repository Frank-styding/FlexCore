import { Component } from "./Component";

type LayoutConfig = {
  className?: string;
};

type Layout = (
  data: { id: string; config: LayoutConfig },
  subComponents: Component[]
) => Component;

export const Layout: Layout = ({ id, config }, subComponents: Component[]) => {
  return {
    id,
    type: "Layout",
    config,
    events: {},
    buildFuncs: {},
    subComponents,
  };
};

export const LayoutTypeDefinition = `
type LayoutConfig = {
  className?: string;
};

type Layout = (
  data: { id: string; config: LayoutConfig },
  subComponents: Component[]
) => Component;

declare const Layout:Layout;
`;
