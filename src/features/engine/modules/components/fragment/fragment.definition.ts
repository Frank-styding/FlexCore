import { IComponent, IContext } from "../../types/component.type";

// --- 1. Props Principales ---

/**
 * Propiedades del Fragmento.
 * Los fragmentos son contenedores lógicos y no tienen configuración visual ni eventos.
 */
export interface IFragmentProps {
  id: string;
  context?: IContext;
}

// Factory: Recibe props y el array de hijos
export type FragmentFactory = (
  props: IFragmentProps,
  children?: IComponent[]
) => IComponent;

// --- 2. Definiciones para el Editor (Strings) ---

export const FRAGMENT_TYPE_DEFINITION = `
interface IFragmentProps {
  id: string;
}

/**
 * Crea un Fragmento (agrupador lógico sin nodo DOM).
 * @param props Datos básicos (id)
 * @param children Lista de componentes hijos
 */
declare const Fragment: (props: IFragmentProps, children?: IComponent[]) => IComponent;
`;

// No hay eventos de contexto para fragments usualmente
export const FRAGMENT_CONTEXT_EVENT = {
  key: "frag",
  name: "IFragmentMap",
  definition: "", // Sin métodos expuestos
};
