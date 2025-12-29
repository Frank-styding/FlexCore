import { ButtonMap } from "./Button";

export type Context = {
  comp: {
    btn: ButtonMap;
  };
};

export type ComponentEvent = (e: any, context: Context) => void;
export type Events = Record<string, ComponentEvent | undefined>;
export type DynamicResult<T> = T | Promise<T>;
export type DynamicFunction<T> = (context: Context) => DynamicResult<T>;
export type DynamicValue<T> = T | DynamicFunction<T>;

export type IComponentData<T> = T | { data: T; keepData: boolean };
export interface Component {
  type: string;
  id: string;
  config: Record<string, any>;
  data: Record<string, IComponentData<any>>;
  events: Events;
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
type IComponentData<T> = T | { data: T; keepData: boolean };

interface Component {
  type: string;
  id: string;
  config:Record<string, any>;
  data:Record<string, IComponentData<any>>
  events: Events;
  context?: Context;
  subComponents?: Component[] | Component;
}
`;
