import { JSX, useMemo } from "react";
import { useDynamicValue } from "@/features/engine/hooks/useDynamicValue"; // Ajusta ruta según tu proyecto
import { useComponentRegistration } from "@/features/engine/hooks/useComponentRegistration"; // Ajusta ruta
import { useScriptError } from "@/features/engine/hooks/useConnectionError"; // Ajusta ruta
import { cn } from "@/lib/utils";
import { IComponent, IContext } from "../../types/component.type";
import { ITextProps } from "./text.definition";

// --- Mapas de Configuración ---

const TagMap: Record<string, keyof JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  blockquote: "blockquote",
  lead: "p",
  large: "div",
  small: "small",
  muted: "p",
};

const ClassMap: Record<string, string> = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  lead: "text-xl text-muted-foreground",
  large: "text-lg font-semibold",
  small: "text-sm font-medium leading-none",
  muted: "text-sm text-muted-foreground",
};

const AlignMap: Record<string, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

// --- Componente ---

export const DynamicText = ({
  config = {},
  events,
  context,
  id,
  data,
}: IComponent & ITextProps & { context: IContext }) => {
  const execute = useScriptError();

  // 1. Manejo dinámico del contenido
  const [contentRef, setContent, content] = useDynamicValue(
    context,
    data?.content,
    ""
  );

  // 2. Helper para ejecutar eventos
  const handleEvent = (eventName: string, e: any) => {
    if (events && events[eventName]) {
      execute(events[eventName], e, context);
    }
  };

  // 3. Exponer métodos
  const exposedMethods = useMemo(
    () => ({
      setText: (text: string) => setContent(text),
      getText: () => contentRef.current,
    }),
    [setContent, contentRef]
  );

  useComponentRegistration(context, "txt", id, exposedMethods);

  // 4. Renderizado
  const variant = config.variant || "p";
  const Tag = TagMap[variant] || "p";
  const alignClass = AlignMap[config.align || "left"];
  const variantClass = ClassMap[variant] || ClassMap["p"];

  // Feedback visual si hay evento click
  const isClickable = !!events?.onClick;

  return (
    <Tag
      className={cn(
        variantClass,
        alignClass,
        isClickable && "cursor-pointer hover:opacity-80 transition-opacity",
        config.className
      )}
      style={config.style}
      onClick={(e) => handleEvent("onClick", e)}
      onMouseEnter={(e) => handleEvent("onMouseEnter", e)}
      onMouseLeave={(e) => handleEvent("onMouseLeave", e)}
    >
      {content}
    </Tag>
  );
};
