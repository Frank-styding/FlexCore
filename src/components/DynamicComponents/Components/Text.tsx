/* eslint-disable react-hooks/immutability */
import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { useDynamicValue } from "@/components/DynamicComponents/useDynamicValue";
import { JSX, useMemo } from "react";
import { useComponentRegistration } from "../useComponentRegistration";
import { cn } from "@/lib/utils";

type TextProps = Component & {
  context: Context;
  data: {
    content: any; // DynamicValue<string>
  };
  config: {
    className?: string;
    variant?:
      | "h1"
      | "h2"
      | "h3"
      | "h4"
      | "p"
      | "blockquote"
      | "lead"
      | "large"
      | "small"
      | "muted";
    align?: "left" | "center" | "right" | "justify";
    style: Record<string, any>;
  };
};

// Mapa de variantes a etiquetas HTML
const TagMap: Record<string, string> = {
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

// Mapa de variantes a clases de Tailwind (Tipografía Shadcn)
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

export const DynamicText = ({
  config,
  events,
  context,
  id,
  data,
}: TextProps) => {
  // 1. Manejo dinámico del contenido
  const [contentRef, setContent, content] = useDynamicValue(
    context,
    data.content,
    ""
  );

  // 2. Exponer métodos
  const exposedMethods = useMemo(
    () => ({
      setText: (text: string) => setContent(text),
      getText: () => contentRef.current,
    }),
    [setContent, contentRef]
  );

  useComponentRegistration(context, "text", id, exposedMethods);

  // 3. Determinar etiqueta y clases
  const variant = config.variant || "p";
  const Tag = (TagMap[variant] as keyof JSX.IntrinsicElements) || "p";
  const alignClass = AlignMap[config.align || "left"];
  const variantClass = ClassMap[variant] || ClassMap["p"];

  return (
    <Tag
      className={cn(
        variantClass,
        alignClass,
        events.onClick && "cursor-pointer hover:opacity-80 transition-opacity", // Feedback visual si es clickeable
        config.className
      )}
      onClick={() => events.onClick?.(null, context)}
      style={config.style}
    >
      {content}
    </Tag>
  );
};
