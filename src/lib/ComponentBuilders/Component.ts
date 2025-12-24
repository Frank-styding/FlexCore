export type Context = Record<string, any>;
export type ComponentEvent = (e: any, context: Context) => void;
export type Events = Record<string, ComponentEvent>;

export interface BuildFuncs {
  init?: () => Context;
  update?: () => Context;
}

export interface Component {
  type: string;
  config: Record<string, any>;
  events: Events;
  buildFuncs: BuildFuncs;
  subComponents?: Component[] | Component;
}
