export type IContext = {
  comp: Record<string, any>;
  events: {
    suscribe: (id: string, fn: () => void) => void;
    unSuscribe: (id: string) => void;
    register: (id: string, fn: () => any) => void;
    unregister: (id) => void;
    call: (id: string, data: any) => any;
    trigger: (id: string, data: any) => void;
  };
};

export type IComponentEvent = (e: any, context: IContext) => void;
export type IEvents = Record<string, IComponentEvent | undefined>;
export type IDynamicResult<T> = T | Promise<T>;
export type IDynamicFunction<T> = (context: IContext) => IDynamicResult<T>;
export type IDynamicValue<T> = T | IDynamicFunction<T>;

export type IComponentData<T> =
  | IDynamicValue<T>
  | { data: IDynamicValue<T>; keepData: boolean };

export interface IComponent {
  type: string;
  id: string;
  config: Record<string, any>;
  data: Record<string, IComponentData<any>>;
  events: IEvents;
  context?: IContext;
  subComponents?: IComponent[] | IComponent;
  load?: () => void;
}
