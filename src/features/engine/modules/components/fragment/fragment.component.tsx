import { ReactNode } from "react";
import { IComponent, IContext } from "../../types/component.type";
import { IFragmentProps } from "./fragment.definition";

/**
 * Renderiza un React Fragment (<>...</>).
 * Asume que el Engine procesa 'subComponents' y los pasa como 'children'.
 */
export const DynamicFragment = ({
  children,
}: IComponent &
  IFragmentProps & { context: IContext; children: ReactNode }) => {
  return <>{children}</>;
};
