export type Context = {
  comp: Record<string, any>;
};

export type ComponentEvent = (e: any, context: Context) => void;
export type Events = Record<string, ComponentEvent>;

export interface BuildFuncs {
  init?: () => Context;
  update?: () => Context;
}

export interface Component {
  type: string;
  id: string;
  config: Record<string, any>;
  events: Events;
  buildFuncs: BuildFuncs;
  context?: Context;
  subComponents?: Component[] | Component;
}

export const ComponentType = `
type Context = {
  comp: Record<string, any>;
};
type ComponentEvent = (e: any, context: Context) => void;
type Events = Record<string, ComponentEvent>;

interface BuildFuncs {
  init?: () => Context;
  update?: () => Context;
}

interface Component {
  type: string;
  id: string;
  config: Record<string, any>;
  events: Events;
  context?: Context;
  buildFuncs: BuildFuncs;
  subComponents?: Component[] | Component;
}
`;
