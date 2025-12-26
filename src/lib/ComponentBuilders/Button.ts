import { BuildFuncs, Component, ComponentEvent, Context } from "./Component";

type ButtonConfig = {
  className?: string;
  variant?: "outline" | "default";
  label?: string;
  icon: string;
};

type Button = (data: {
  id: string;
  config: ButtonConfig;
  onClick: ComponentEvent;
  buildFuncs: BuildFuncs;
  context?: Context;
}) => Component;

export const Button: Button = ({
  id,
  config,
  onClick,
  buildFuncs,
  context,
}) => {
  return {
    id,
    type: "Button",
    context,
    config,
    events: { onClick },
    buildFuncs,
  };
};

export const ButtonType = `
type ButtonConfig = {
  className?: string;
  variant?: "outline" | "default";
  label?: string;
  icon: string;
};

type Button = (data: {
  id: string;
  config: ButtonConfig;
  onClick: ComponentEvent;
  buildFuncs: BuildFuncs;
  context?: Context;
}) => Component;

declare const Button:Button;
`;
