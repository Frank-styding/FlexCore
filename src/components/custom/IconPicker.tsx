import { Check, ChevronsUpDown } from "lucide-react";
import { icons } from "lucide-react"; // Importamos todos los iconos
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useState } from "react";
import { Button } from "../ui/button";

export const IconPicker = ({
  value,
  onChange,
  placeholder = "Seleccionar icono...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);

  // Convertimos el objeto 'icons' en un array para poder mapearlo
  // NOTA: Esto carga todos los iconos, ten cuidado con el bundle size en producción.
  const iconList = Object.keys(icons) as (keyof typeof icons)[];

  // Componente para renderizar el icono seleccionado dinámicamente
  const SelectedIcon = value ? icons[value as keyof typeof icons] : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? (
            <div className="flex items-center gap-2">
              {/* Renderizamos el icono visualmente si existe */}
              {SelectedIcon && <SelectedIcon className="h-4 w-4" />}
              <span>{value}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar icono..." />
          <CommandList>
            <CommandEmpty>No se encontró el icono.</CommandEmpty>
            <CommandGroup>
              {/* Limitamos a los primeros 50 o 100 para no congelar la UI si hay demasiados, 
                  o usamos virtualización si es necesario. Aquí renderizo todos simplificado */}
              {iconList.map((iconName) => {
                const IconComponent = icons[iconName];
                return (
                  <CommandItem
                    key={iconName}
                    value={iconName}
                    onSelect={(currentValue) => {
                      // Shadcn command a veces devuelve lowercase, aseguramos el valor correcto
                      onChange(currentValue === value ? "" : iconName);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === iconName ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <span>{iconName}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
