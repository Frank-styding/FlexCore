/* eslint-disable react-hooks/immutability */
import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { useDynamicValue } from "@/components/DynamicComponents/useDynamicValue";
import { useCallback, useMemo, useState } from "react";
import { useComponentRegistration } from "../useComponentRegistration";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; // Nuevo
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScriptError } from "@/hooks/useScriptError";
import { v4 as uuid } from "uuid";

// Iconos disponibles
import {
  Search,
  Trash,
  Edit,
  Copy,
  Eye,
  Plus,
  MoreHorizontal,
  Settings,
} from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";

// Mapeo de iconos por nombre (string)
const ICON_MAP: Record<string, any> = {
  Trash,
  Edit,
  Copy,
  Eye,
  Plus,
  Settings,
  More: MoreHorizontal,
};

type GalleryProps = Component & {
  context: Context;
  data: {
    items: any;
  };
  config: {
    className?: string;
    searchable?: boolean;
    cardSize?: string;
    height?: string;
    style?: {
      gallery?: Record<string, any>;
      title?: Record<string, any>;
      description?: Record<string, any>;
      img?: Record<string, any>;
      card?: Record<string, any>;
    };
    // Configuraciones nuevas
    addButton?: {
      label: string;
      icon?: string;
      variant?: "outline" | "default";
    };
    contextMenu?: Array<{
      label: string;
      icon?: string;
      variant?: "default" | "destructive";
      separator?: boolean;
    }>;
  };
};

export const DynamicGallery = ({
  config,
  events,
  context,
  id,
  data,
}: GalleryProps) => {
  const [itemsRef, setItems, items, reloadItems] = useDynamicValue(
    context,
    data.items,
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const execute = useScriptError();

  const handleCardClick = (item: any) => {
    if (events.onCardClick) {
      execute(events.onCardClick, item, context);
    }
  };

  // Ejecuta la acción del botón "Agregar"
  const handleAddClick = useCallback(() => {
    if (events.onAddClick) {
      execute(events.onAddClick, null, context);
    }
  }, [execute, context, events.onAddClick]);

  // Ejecuta una acción específica del menú contextual por índice
  const handleContextAction = useCallback(
    (index: number, item: any) => {
      const eventName = `onContextAction_${index}`;
      if (events[eventName]) {
        execute(events[eventName], item, context);
      }
    },
    [context, events, execute]
  );

  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    if (!searchTerm)
      return items
        .filter(Boolean)
        .map((item) => ({ ...item, id: item.id ?? uuid() }));
    return items
      .filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(Boolean)
      .map((item) => ({ ...item, id: item.id ?? uuid() }));
  }, [items, searchTerm]);

  const exposedMethods = useMemo(
    () => ({
      setItems: (newItems: any[]) => setItems(newItems),
      getItems: () => itemsRef.current,
      reload: () => reloadItems(),
    }),
    [setItems, itemsRef, reloadItems]
  );

  useComponentRegistration(context, "gallery", id, exposedMethods);

  const sizeClass = config.cardSize || "w-[20rem] h-[11rem]";
  const containerHeight = config.height || "h-full";

  return (
    <div
      className={`flex flex-col gap-6 min-h-0 overflow-hidden ${containerHeight} ${
        config.className || ""
      }`}
      style={
        typeof config.style?.gallery == "object"
          ? config.style.gallery
          : undefined
      }
    >
      {/* --- HEADER: Buscador + Botón Agregar --- */}
      {(config.searchable !== false || config.addButton) && (
        <div className="flex-none flex justify-center items-center gap-2 w-full px-5 pt-6">
          {/* Barra de búsqueda */}
          {config.searchable !== false && (
            <div className="relative w-full max-w-125">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50 border-muted-foreground/20 focus:border-primary transition-colors"
              />
            </div>
          )}

          {/* Botón de Agregar (Configurable) */}
          {config.addButton && (
            <Button
              onClick={handleAddClick}
              className="gap-2 shrink-0"
              variant={config.addButton.variant}
            >
              {config.addButton.icon &&
                ICON_MAP[config.addButton.icon] &&
                (() => {
                  const Icon = ICON_MAP[config.addButton.icon];
                  return <Icon className="h-4 w-4" />;
                })()}
              {!config.addButton.icon && <Plus className="h-4 w-4" />}
              <span className="hidden sm:inline">{config.addButton.label}</span>
            </Button>
          )}
        </div>
      )}

      {/* --- ScrollArea --- */}
      <ScrollArea className="flex-1 h-full w-full rounded-md border border-border/40 bg-background/50">
        <div className="p-6 mb-25">
          <div className="flex flex-wrap gap-5 content-start justify-center sm:justify-start">
            {filteredItems.map((item) => (
              <ContextMenu key={item.id}>
                <ContextMenuTrigger asChild>
                  <Card
                    className={`
                      group relative flex flex-row items-center justify-center overflow-hidden px-3
                      border border-border/50 bg-card 
                      hover:shadow-xl hover:border-primary/20 
                      transition-all duration-300 ease-in-out cursor-pointer
                      flex-none shrink-0 
                      ${sizeClass}
                    `}
                    style={
                      typeof config.style?.card == "object"
                        ? config.style.card
                        : undefined
                    }
                    onClick={() => handleCardClick(item)}
                  >
                    {/* ... (Contenido de la card igual que antes) ... */}
                    <div className="relative overflow-hidden bg-muted flex place-content-center shrink-0 rounded-md">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          style={
                            typeof item.style?.img == "object"
                              ? item.style.img
                              : undefined
                          }
                          className="size-[8rem] object-cover transition-transform duration-500 group-hover:scale-110 rounded-md"
                        />
                      )}
                    </div>
                    <div className="p-4 flex flex-col justify-center bg-card z-10 flex-1 min-w-0">
                      <h3
                        className="font-semibold text-base leading-tight truncate text-foreground group-hover:text-primary transition-colors"
                        title={item.title}
                        style={
                          typeof config.style?.title == "object"
                            ? config.style.title
                            : undefined
                        }
                      >
                        {item.title}
                      </h3>
                      {item.description && (
                        <p
                          style={
                            typeof config.style?.description == "object"
                              ? config.style.description
                              : undefined
                          }
                          className="text-sm text-muted-foreground mt-1 line-clamp-3 leading-snug break-words"
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </Card>
                </ContextMenuTrigger>

                {/* MENÚ CONTEXTUAL DINÁMICO */}
                {config.contextMenu && config.contextMenu.length > 0 && (
                  <ContextMenuContent className="w-48">
                    {config.contextMenu.map((menuItem, index) => {
                      if (menuItem.separator) {
                        return <ContextMenuSeparator key={index} />;
                      }

                      const IconComp = menuItem.icon
                        ? ICON_MAP[menuItem.icon]
                        : null;
                      const isDestructive = menuItem.variant === "destructive";

                      return (
                        <ContextMenuItem
                          key={index}
                          className={`cursor-pointer ${
                            isDestructive
                              ? "text-red-600 focus:text-red-600 focus:bg-red-100/10"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContextAction(index, item);
                          }}
                        >
                          {IconComp && <IconComp className="mr-2 h-4 w-4" />}
                          <span>{menuItem.label}</span>
                        </ContextMenuItem>
                      );
                    })}
                  </ContextMenuContent>
                )}
              </ContextMenu>
            ))}

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <div className="w-full flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <Search className="h-8 w-8 mb-2 opacity-50" />
                <p>No se encontraron resultados.</p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
