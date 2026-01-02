import { IComponent } from "../../types/component.type";
import { GalleryFactory } from "./gallery.definition";

export const Gallery: GalleryFactory = ({
  id,
  config = {},
  items,
  context,
  load,
  // Props especiales
  onCardClick,
  addButton,
  contextMenu,
}) => {
  const componentEvents: Record<string, any> = {};

  // 1. Evento Click Principal
  if (onCardClick) componentEvents.onCardClick = onCardClick;

  // 2. Procesar Botón de Agregar
  let internalAddButton: any = undefined;
  if (addButton) {
    componentEvents.onAddClick = addButton.onClick;
    internalAddButton = {
      label: addButton.label,
      icon: addButton.icon,
      variant: addButton.variant,
    };
  }

  // 3. Procesar Menú Contextual
  // Convertimos el array de objetos con 'onClick' a un array de configuración visual
  // y un conjunto de eventos mapeados por índice: onContextAction_0, onContextAction_1...
  const internalContextMenu = contextMenu?.map((item, index) => {
    if ("separator" in item) return { separator: true };

    // Registramos el evento con un ID único basado en el índice
    const eventName = `onContextAction_${index}`;
    componentEvents[eventName] = item.onClick;

    return {
      label: item.label,
      icon: item.icon,
      variant: item.variant,
      // No pasamos onClick aquí, el componente lo deducirá por el índice
    };
  });

  return {
    id,
    type: "Gallery",
    context,
    load,
    data: { items },
    config: {
      searchable: true, // Default
      height: "h-full",
      ...config,
      // Pasamos las configs procesadas internamente
      _addButton: internalAddButton,
      _contextMenu: internalContextMenu,
    },
    events: componentEvents,
  };
};
