import { IconName } from "@/components/custom/DynamicIcon";
import { BuildFuncs, Component, Events } from "./Component";

type ButtonConfig = { className?: string; label?: string; icon?: IconName };
type Button = (data: {
  config: ButtonConfig;
  events: Events;
  buildFuncs: BuildFuncs;
}) => Component;

export const Button: Button = ({ config, events, buildFuncs }) => {
  return {
    type: "Button",
    config,
    events,
    buildFuncs,
  };
};

export const ButtonTypeDefinition = `
type ButtonConfig = { className?: string; label?: string; icon?: IconName };
type Button = (data: {
  config: ButtonConfig;
  events: Events;
  buildFuncs: BuildFuncs;
}) => Component;

declare const Button:Button;
`;
