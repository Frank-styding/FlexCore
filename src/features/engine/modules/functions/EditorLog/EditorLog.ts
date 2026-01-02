import { useEditorStore } from "@/features/engine/store/editor.store";
import { useCallback } from "react";
const serializeWithFunctions = (item: any, seen = new WeakSet()): any => {
  // Si es una función, retornamos su representación en string
  if (typeof item === "function") {
    return `[Function: ${item.name || "anonymous"}]`;
  }

  // Si es primitivo o null, lo devolvemos tal cual
  if (item === null || typeof item !== "object") {
    return item;
  }

  // Manejo de referencias circulares para evitar crash
  if (seen.has(item)) {
    return "[Circular]";
  }
  seen.add(item);

  // Si es un array, procesamos cada elemento
  if (Array.isArray(item)) {
    return item.map((i) => serializeWithFunctions(i, seen));
  }

  // Si es un objeto, procesamos cada llave
  const result: any = {};
  for (const key in item) {
    if (Object.prototype.hasOwnProperty.call(item, key)) {
      result[key] = serializeWithFunctions(item[key], seen);
    }
  }
  return result;
};

interface LogEntry {
  message: string;
  data?: any[]; // El '?' hace que la propiedad sea opcional
}

export const EditorLog = () => {
  const state = useEditorStore.getState();
  const isEditing = state.isEditing; // O la propiedad correcta de tu store
  const addExecutionLogs = state.addExecutionLogs;

  return (...args: any) => {
    if (isEditing) {
      const entry: LogEntry = { message: "" };

      // Filtramos los que NO son strings y aplicamos la serialización
      // para preservar las funciones dentro de los objetos
      entry.data = args
        .filter((item) => typeof item != "string")
        .map((item) => serializeWithFunctions(item));

      entry.message = args.filter((item) => typeof item == "string").join(",");

      addExecutionLogs([entry]);
    } else {
      console.log(...args);
    }
  };
};
