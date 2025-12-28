import { useModals } from "@/components/providers/ModalProvider";
import { Context } from "@/lib/ComponentBuilders/Component";
import { v4 as uuid } from "uuid";
import { useScriptEditor } from "./useScriptEditor";
import { LogEntry } from "@/lib/runScript/runScript";
import { useScriptConnectionActions } from "./useScriptConnectionActions";

export const useScriptActions = () => {
  const { openModal, closeModal } = useModals();
  const { addExecutionLogs, isEditing } = useScriptEditor();
  const { execQuery } = useScriptConnectionActions();
  const context: Context = { comp: {} };
  /*   const execQuery = (query: string) => {
    return ["hola"];
  };
 */
  const handleOpenModal = (id: string) => {
    openModal(id);
  };

  const handleCloseModal = (id: string) => {
    closeModal(id);
  };

  const Editor = {
    log: (...args: any) => {
      if (isEditing) {
        const entry: LogEntry = { message: "" };
        entry.data = args.filter((item) => typeof item != "string");
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
declare const Editor:{ log:(value:any)=> void }
`;
