export const ContextType = (data: Record<string, string>) => {
  return `type IContext = {
  comp: {
  ${Object.keys(data)
    .map((item) => `${item}:${data[item]};`)
    .join(";\n")}
  };
  events: {
    suscribe: (id: string, fn: () => void) => void;
    unSuscribe: (id: string) => void;
    register: (id: string, fn: () => any) => void;
    unregister: (id:string) => void;
    call: (id: string, data: any) => any;
    trigger: (id: string, data: any) => void;
  };
};
declare const context:IContext;
`;
};
export const ComponentType = `


type IComponentEvent = (e: any, context: IContext) => void;
type IEvents = Record<string, IComponentEvent | undefined>;
type IDynamicResult<T> = T | Promise<T>;
type IDynamicFunction<T> = (context: IContext) => IDynamicResult<T>;
type IDynamicValue<T> = T | IDynamicFunction<T>;

type IComponentData<T> =
  | IDynamicValue<T>
  | { data: IDynamicValue<T>; keepData: boolean };

interface IComponent {
  type: string;
  id: string;
  config: Record<string, any>;
  data: Record<string, IComponentData<any>>;
  events: IEvents;
  context?: IContext;
  subComponents?: IComponent[] | IComponent;
  load?: () => void;
}

`;
