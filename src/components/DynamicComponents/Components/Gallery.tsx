/* eslint-disable react-hooks/immutability */
import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { useDynamicValue } from "@/components/DynamicComponents/useDynamicValue";
import { useMemo, useState } from "react";
import { useComponentRegistration } from "../useComponentRegistration";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

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
  };
};

export const DynamicGallery = ({
  config,
  events,
  context,
  id,
  data,
}: GalleryProps) => {
  const [itemsRef, setItems, items] = useDynamicValue(context, data.items, []);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCardClick = (item: any) => {
    console.log(events);
    events.onCardClick?.(item, context);
  };

  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    if (!searchTerm) return items;
    return items.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const exposedMethods = useMemo(
    () => ({
      setItems: (newItems: any[]) => setItems(newItems),
      getItems: () => itemsRef.current,
    }),
    [setItems, itemsRef]
  );

  useComponentRegistration(context, "gallery", id, exposedMethods);

  const sizeClass = config.cardSize || "w-[20rem] h-[11rem]";
  const containerHeight = config.height || "h-full";

  return (
    // CAMBIO CRÍTICO:
    // 1. min-h-0: Evita que el flex item crezca más allá de su contenedor.
    // 2. overflow-hidden: Asegura que si algo sobra, no empuje el layout.
    <div
      className={`flex flex-col gap-6 min-h-0 overflow-hidden ${containerHeight} ${
        config.className || ""
      }`}
    >
      {/* --- Buscador --- */}
      {config.searchable !== false && (
        <div className="flex-none flex justify-center w-full px-5 pt-6">
          <div className="relative w-full max-w-125">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en la galería..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-muted-foreground/20 focus:border-primary transition-colors"
            />
          </div>
        </div>
      )}

      {/* --- ScrollArea --- */}
      {/* h-full + flex-1 asegura que tome el espacio restante exacto */}
      <ScrollArea className="flex-1 h-full w-full rounded-md border border-border/40 bg-background/50">
        <div className="p-6 mb-25">
          <div className="flex flex-wrap gap-5 content-start justify-center sm:justify-start">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className={`
                    group relative flex flex-row items-center justify-center overflow-hidden px-3
                    border border-border/50 bg-card 
                    hover:shadow-xl hover:border-primary/20 
                    transition-all duration-300 ease-in-out cursor-pointer
                    flex-none shrink-0 
                    ${sizeClass}
                `}
                onClick={() => handleCardClick(item)}
              >
                <div className="relative overflow-hidden bg-muted flex place-content-center shrink-0 rounded-md">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="size-[8rem] object-cover transition-transform duration-500 group-hover:scale-110 rounded-md"
                    />
                  )}
                </div>

                <div className="p-4 flex flex-col justify-center bg-card z-10 flex-1 min-w-0">
                  <h3
                    className="font-semibold text-base leading-tight truncate text-foreground group-hover:text-primary transition-colors"
                    title={item.title}
                  >
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-3 leading-snug break-words">
                      {item.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}

            {filteredItems.length === 0 && (
              <div className="w-full flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <Search className="h-8 w-8 mb-2 opacity-50" />
                <p>No se encontraron resultados para {searchTerm}</p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
