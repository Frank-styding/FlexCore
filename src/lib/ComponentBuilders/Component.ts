import { ButtonMap } from "./Button";

export type Context = {
  comp: {
    btn: ButtonMap;
  };
};

export type ComponentEvent = (e: any, context: Context) => void;
export type Events = Record<string, ComponentEvent>;
export type DynamicResult<T> = T | Promise<T>;
export type DynamicFunction<T> = (context: Context) => DynamicResult<T>;
export type DynamicValue<T> = T | DynamicFunction<T>;

export interface BuildFuncs {
  load?: () => Context;
}

export interface Component {
  type: string;
  id: string;
  config: Record<string, any>;
  data: Record<string, any>;
  events: Events;
  buildFuncs: BuildFuncs;
  context?: Context;
  subComponents?: Component[] | Component;
}

export const createContext = (): Context => {
  return {
    comp: {
      btn: {},
    },
  };
};

export const ComponentType = `
type Context = {
  comp: {
    btn: ButtonMap;
    nav: NavigationMap;
    gallery: GalleryMap;
    table:TableMap;
    text:TextMap;
  };
};


type ComponentEvent = (e: any, context: Context) => void;
type Events = Record<string, ComponentEvent>;

type DynamicResult<T> = T | Promise<T>;
type DynamicFunction<T> = (context: Context) => DynamicResult<T>;
type DynamicValue<T> = T | DynamicFunction<T>;

interface BuildFuncs {
  load?: () => Context;
  update?: () => Context;
}

interface Component {
  type: string;
  id: string;
  config:Record<string, any>;
  data:Record<string,any>;
  events: Events;
  buildFuncs: BuildFuncs;
  context?: Context;
  subComponents?: Component[] | Component;
}
`;
