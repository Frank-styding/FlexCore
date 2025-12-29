import { useModals } from "@/components/providers/ModalProvider";
import { Context, createContext } from "@/lib/ComponentBuilders/Component";
import { v4 as uuid } from "uuid";
import { useScriptEditor } from "./useScriptEditor";
import { LogEntry } from "@/lib/runScript/runScript";
import { useScriptConnectionActions } from "./useScriptConnectionActions";

export const useScriptActions = () => {
  const { openModal, closeModal } = useModals();
  const { addExecutionLogs, isEditing } = useScriptEditor();
  const { execQuery } = useScriptConnectionActions();
  const context: Context = createContext();

  const handleOpenModal = (id: string) => {
    openModal(id);
  };

  const handleCloseModal = (id: string) => {
    closeModal(id);
  };

  // Función auxiliar para transformar funciones en strings legibles
  // y evitar errores de referencia circular
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

  const Editor = {
    log: (...args: any) => {
      if (isEditing) {
        const entry: LogEntry = { message: "" };

        // Filtramos los que NO son strings y aplicamos la serialización
        // para preservar las funciones dentro de los objetos
        entry.data = args
          .filter((item) => typeof item != "string")
          .map((item) => serializeWithFunctions(item));

        entry.message = args
          .filter((item) => typeof item == "string")
          .join(",");

        addExecutionLogs([entry]);
      }
    },
  };

  return {
    execQuery,
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
    uuid,
    Editor,
    context,
  };
};

export const ActionsTypes = `
declare function execQuery(query: string, context?: Record<string,any>): Promise<any[]>;
declare function openModal(id:string):void;
declare function closeModal(id:string):void;
declare const context:Context;
declare function uuid():string;
declare const Editor:{ log:(...args:any[])=> void }
`;
