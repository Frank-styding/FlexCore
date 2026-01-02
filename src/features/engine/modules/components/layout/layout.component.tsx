import { ReactNode, useMemo } from "react";
import { useScriptError } from "@/features/engine/hooks/useConnectionError";
import { useComponentRegistration } from "@/features/engine/hooks/useComponentRegistration";
import { cn } from "@/lib/utils"; // Utilidad recomendada para clases
import { IComponent, IContext } from "../../types/component.type";
import { ILayoutProps } from "./layout.definition";

export const DynamicLayout = ({
  config = {},
  events,
  children,
  context,
  id,
}: IComponent & ILayoutProps & { context: IContext; children: ReactNode }) => {
  const execute = useScriptError();

  // 1. Helper de eventos
  const handleEvent = (eventName: string, e: any) => {
    // Evita propagación si es un contenedor interactivo, opcionalmente
    // e.stopPropagation();
    if (events && events[eventName]) {
      execute(events[eventName], e, context);
    }
  };

  // 2. Registro del componente (aunque no tenga métodos, es buena práctica registrarlo)
  const exposedMethods = useMemo(() => ({}), []);
  useComponentRegistration(context, "layout", id, exposedMethods);

  // 3. Clases dinámicas
  const isInteractive = !!events?.onClick;

  return (
    <div
      id={config.htmlId}
      className={cn(
        config.className,
        isInteractive && "cursor-pointer" // Feedback visual básico
      )}
      style={config.style}
      onClick={(e) => handleEvent("onClick", e)}
      onMouseEnter={(e) => handleEvent("onMouseEnter", e)}
      onMouseLeave={(e) => handleEvent("onMouseLeave", e)}
    >
      {children}
    </div>
  );
};
