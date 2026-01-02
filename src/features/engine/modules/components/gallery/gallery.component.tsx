import { useCallback, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import Image from "next/image"; // Asegúrate de configurar next.config.js para dominios externos o usa <img />
import { Search } from "lucide-react";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { DynamicIcon, IconName } from "@/components/ui/dynamic-icon"; // Tu componente de iconos dinámico

// Engine Hooks
import { useComponentRegistration } from "@/features/engine/hooks/useComponentRegistration";
import { useDynamicValue } from "@/features/engine/hooks/useDynamicValue";
import { useScriptError } from "@/features/engine/hooks/useConnectionError";
import { cn } from "@/lib/utils";

import { IComponent, IContext } from "../../types/component.type";
import { IGalleryProps, IGalleryItem } from "./gallery.definition";

export const DynamicGallery = ({
  config = {},
  events,
  context,
  id,
  data,
}: IComponent & IGalleryProps & { context: IContext }) => {
  const execute = useScriptError();

  // 1. Datos Dinámicos
  const [itemsRef, setItems, items, reloadItems] = useDynamicValue<
    IGalleryItem[]
  >(context, data?.items, []);

  const [searchTerm, setSearchTerm] = useState("");

  // 2. Handlers de Eventos
  const handleCardClick = (item: IGalleryItem) => {
    if (events?.onCardClick) {
      execute(events.onCardClick, item, context);
    }
  };

  const handleAddClick = useCallback(() => {
    if (events?.onAddClick) {
      execute(events.onAddClick, null, context);
    }
  }, [events, execute, context]);

  const handleContextAction = useCallback(
    (index: number, item: IGalleryItem) => {
      // Reconstruimos el nombre del evento basado en el índice
      const eventName = `onContextAction_${index}`;
      if (events && events[eventName]) {
        execute(events[eventName], item, context);
      }
    },
    [events, execute, context]
  );

  // 3. Filtrado
  const filteredItems = useMemo(() => {
    const rawItems = Array.isArray(items) ? items : [];
    const term = searchTerm.toLowerCase();

    return rawItems
      .filter((item) => {
        if (!term) return true;
        return item.title?.toLowerCase().includes(term);
      })
      .map((item) => ({ ...item, id: item.id ?? uuid() })); // Asegurar ID
  }, [items, searchTerm]);

  // 4. API Expuesta
  const exposedMethods = useMemo(
    () => ({
      setItems: (newItems: IGalleryItem[]) => setItems(newItems),
      getItems: () => itemsRef.current,
      reload: () => reloadItems(),
    }),
    [setItems, itemsRef, reloadItems]
  );

  useComponentRegistration(context, "gallery", id, exposedMethods);

  // 5. Variables de Renderizado
  const { _addButton, _contextMenu } = config;
  const sizeClass = config.cardSize || "w-80 h-44"; // Default size
  const containerHeight = config.height || "h-full";

  return (
    <div
      className={cn(
        "flex flex-col gap-6 min-h-0 overflow-hidden",
        containerHeight,
        config.className
      )}
      style={config.style?.gallery}
    >
      {/* Header: Buscador + Botón Agregar */}
      {(config.searchable !== false || _addButton) && (
        <div className="flex-none flex justify-center items-center gap-2 w-full px-5 pt-6">
          {config.searchable !== false && (
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/50 border-muted-foreground/20 focus:border-primary transition-colors"
              />
            </div>
          )}

          {_addButton && (
            <Button
              onClick={handleAddClick}
              className="gap-2 shrink-0"
              variant={_addButton.variant as any}
            >
              {_addButton.icon ? (
                <DynamicIcon
                  name={_addButton.icon as IconName}
                  className="h-4 w-4"
                />
              ) : (
                <DynamicIcon name="Plus" className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{_addButton.label}</span>
            </Button>
          )}
        </div>
      )}

      {/* Grid de Contenido */}
      <ScrollArea className="flex-1 h-full w-full rounded-md border border-border/40 bg-background/50">
        <div className="p-6 mb-20">
          <div className="flex flex-wrap gap-5 content-start justify-center sm:justify-start">
            {filteredItems.map((item) => (
              <ContextMenu key={item.id}>
                <ContextMenuTrigger asChild>
                  <Card
                    className={cn(
                      "group relative flex flex-row items-center justify-center overflow-hidden px-3",
                      "border border-border/50 bg-card",
                      "hover:shadow-xl hover:border-primary/20",
                      "transition-all duration-300 ease-in-out cursor-pointer",
                      "flex-none shrink-0",
                      sizeClass
                    )}
                    style={config.style?.card}
                    onClick={() => handleCardClick(item)}
                  >
                    {/* Imagen */}
                    <div className="relative overflow-hidden bg-muted flex place-content-center shrink-0 rounded-md size-32">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          unoptimized // Recomendado para URLs dinámicas externas
                          className="object-cover transition-transform duration-500 group-hover:scale-110 rounded-md"
                          style={config.style?.img}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                          <DynamicIcon
                            name="Image"
                            className="h-8 w-8 opacity-20"
                          />
                        </div>
                      )}
                    </div>

                    {/* Contenido Texto */}
                    <div className="p-4 flex flex-col justify-center bg-card z-10 flex-1 min-w-0">
                      <h3
                        className="font-semibold text-base leading-tight truncate text-foreground group-hover:text-primary transition-colors"
                        title={item.title}
                        style={config.style?.title}
                      >
                        {item.title}
                      </h3>
                      {item.description && (
                        <p
                          className="text-sm text-muted-foreground mt-1 line-clamp-3 leading-snug wrap-break-word"
                          style={config.style?.description}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </Card>
                </ContextMenuTrigger>

                {/* Context Menu Dinámico */}
                {_contextMenu && _contextMenu.length > 0 && (
                  <ContextMenuContent className="w-48">
                    {_contextMenu.map((menuItem, index) => {
                      if (menuItem.separator) {
                        return <ContextMenuSeparator key={index} />;
                      }

                      const isDestructive = menuItem.variant === "destructive";

                      return (
                        <ContextMenuItem
                          key={index}
                          className={cn(
                            "cursor-pointer",
                            isDestructive &&
                              "text-red-600 focus:text-red-600 focus:bg-red-100/10"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContextAction(index, item);
                          }}
                        >
                          {menuItem.icon && (
                            <DynamicIcon
                              name={menuItem.icon as IconName}
                              className="mr-2 h-4 w-4"
                            />
                          )}
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
              <div className="w-full flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg opacity-50">
                <Search className="h-8 w-8 mb-2" />
                <p>No se encontraron resultados.</p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
