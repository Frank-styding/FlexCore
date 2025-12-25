import { BuildFuncs, Component, ComponentEvent } from "./Component";

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
}) => Component;

export const Button: Button = ({ id, config, onClick, buildFuncs }) => {
  return {
    id,
    type: "Button",
    config,
    events: { onClick },
    buildFuncs,
  };
};

export const ButtonTypeDefinition = `
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
}) => Component;

declare const Button:Button;
`;
