"use client";

import React, { useEffect, useState, useRef } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

// --- Tipos ---

export interface TabData {
  id: string;
  label: string;
}

interface TabsProps {
  initialTabs?: TabData[];
  onSelect?: (tabId: string) => void;
  onDelete?: (tabId: string) => void;
  onAdd?: (newTab: TabData) => void;
  onRename?: (tabId: string, newLabel: string) => void;
  onReorder?: (newOrder: TabData[]) => void;

  /** * BLOQUEADOR: Si se provee, se ejecutará antes de eliminar.
   * @param tabId El ID de la pestaña a eliminar.
   * @param confirmDelete La función que DEBE llamarse para proceder con la eliminación.
   */
  onDeleteRequest?: (tabId: string, confirmDelete: () => void) => void;
}

// --- Componente Individual (Sin cambios) ---

interface SortableTabProps {
  tab: TabData;
  isActive: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
  onRename: (id: string, newName: string) => void;
}

const SortableTab = ({
  tab,
  isActive,
  onClick,
  onClose,
  onRename,
}: SortableTabProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: tab.id });

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(tab.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleFinishEdit = () => {
    setIsEditing(false);
    if (editValue.trim() !== "") {
      onRename(tab.id, editValue);
    } else {
      setEditValue(tab.label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleFinishEdit();
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(tab.label);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "group flex min-w-[120px] max-w-[200px] cursor-pointer select-none items-center justify-between border-r px-4 py-1.5 text-sm transition-colors shrink-0",
        isActive
          ? "bg-background font-medium text-foreground z-10 shadow-[inset_0_-2px_0_0_hsl(var(--primary))]"
          : "bg-muted/50 hover:bg-muted text-muted-foreground"
      )}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleFinishEdit}
          onKeyDown={handleKeyDown}
          onPointerDown={(e) => e.stopPropagation()}
          className="h-5 w-full min-w-0 max-w-20 bg-transparent outline-none focus:border-b focus:border-primary text-foreground"
        />
      ) : (
        <span
          className="truncate w-full"
          onDoubleClick={() => setIsEditing(true)}
          title="Doble click para renombrar"
        >
          {tab.label}
        </span>
      )}

      <button
        onClick={onClose}
        onPointerDown={(e) => e.stopPropagation()}
        className={cn(
          "ml-2 rounded-full p-0.5 hover:bg-red-200 hover:text-red-700 opacity-0 transition-all",
          (isActive || "group-hover:opacity-100") && "opacity-100"
        )}
      >
        <X className="size-3" />
      </button>
    </div>
  );
};

// --- Componente Principal ---

export function Tabs({
  initialTabs,
  onSelect,
  onDelete,
  onAdd,
  onRename,
  onReorder,
  onDeleteRequest, // <--- Nueva prop recibida
}: TabsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTabId, setActiveTabId] = useState("sheet1");

  const [tabs, setTabs] = useState<TabData[]>(
    initialTabs || [
      { id: "sheet1", label: "Hoja 1" },
      { id: "sheet2", label: "Hoja 2" },
    ]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTabs((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        if (onReorder) onReorder(newOrder);
        return newOrder;
      });
    }
  };

  const handleAddTab = () => {
    const newId = `sheet-${Date.now()}`;
    const num = tabs.length + 1;
    const newTab: TabData = { id: newId, label: `Hoja ${num}` };
    const updatedTabs = [...tabs, newTab];
    setTabs(updatedTabs);
    setActiveTabId(newId);
    if (onAdd) onAdd(newTab);
    if (onSelect) onSelect(newId);
  };

  // --- LÓGICA DE ELIMINACIÓN MODIFICADA ---
  const handleCloseTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (tabs.length <= 1) return;

    // 1. Definimos la acción real de eliminar
    const executeDelete = () => {
      // Nota: Usamos setTabs con callback para asegurar el estado más fresco
      setTabs((currentTabs) => {
        const targetIndex = currentTabs.findIndex((t) => t.id === id);
        const newTabs = currentTabs.filter((t) => t.id !== id);

        // Ajustar tab activa si borramos la que estaba seleccionada
        if (activeTabId === id) {
          const newActiveIndex = Math.max(0, targetIndex - 1);
          // Verificar que existe una pestaña remanente
          if (newTabs[newActiveIndex]) {
            const newActiveId = newTabs[newActiveIndex].id;
            setActiveTabId(newActiveId);
            if (onSelect) onSelect(newActiveId);
          }
        }
        return newTabs;
      });

      // Notificar eliminación exitosa
      if (onDelete) onDelete(id);
    };

    // 2. Comprobamos si hay un interceptor (onDeleteRequest)
    if (onDeleteRequest) {
      // Pasamos el ID y la función para ejecutar la eliminación
      onDeleteRequest(id, executeDelete);
    } else {
      // Si no hay interceptor, eliminamos directamente
      executeDelete();
    }
  };

  const handleTabClick = (id: string) => {
    setActiveTabId(id);
    if (onSelect) onSelect(id);
  };

  const handleRename = (id: string, newLabel: string) => {
    const updatedTabs = tabs.map((t) =>
      t.id === id ? { ...t, label: newLabel } : t
    );
    setTabs(updatedTabs);
    if (onRename) onRename(id, newLabel);
  };

  if (!isMounted) return <div className="h-10 border-t bg-muted/30" />;

  return (
    <div className="flex h-12 w-full items-start pt-1 border-t bg-muted/30">
      <div className="flex flex-1 overflow-x-auto overflow-y-hidden pb-1 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 [&::-webkit-scrollbar-track]:bg-transparent">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToHorizontalAxis]}
        >
          <SortableContext
            items={tabs.map((t) => t.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex h-full min-w-max items-center">
              {tabs.map((tab) => (
                <SortableTab
                  key={tab.id}
                  tab={tab}
                  isActive={activeTabId === tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  onClose={(e) => handleCloseTab(e, tab.id)}
                  onRename={handleRename}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <button
        onClick={handleAddTab}
        className="flex h-full w-10 shrink-0 items-center justify-center border-l hover:bg-muted transition-colors text-muted-foreground z-20 bg-muted/30"
        title="Nueva hoja"
      >
        <Plus className="size-5" />
      </button>
    </div>
  );
}
