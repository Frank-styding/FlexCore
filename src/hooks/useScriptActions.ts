import { useModals } from "@/components/providers/ModalProvider";
import { useDashboards } from "./useDashboards";
import { Context } from "@/lib/ComponentBuilders/Component";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addExecutionLogs } from "@/lib/redux/features/ScriptEditorSlice";

export const useScriptActions = () => {
  const { openModal, closeModal } = useModals();
  const { setConfig } = useDashboards();

  const context: Context = { comp: {} };
  const dispatch = useAppDispatch();
  const execQuery = (query: string) => {
    console.log(query);
    return ["hola"];
  };

  const ConectionConfig = (config: {
    url: string;
    key: string;
    type: string;
  }) => {
    dispatch(
      addExecutionLogs({
        logs: [
          { message: "System: Connected to " + config.url, data: [config] },
        ],
      })
    );
    setConfig(config);
  };

  const handleOpenModal = (id: string) => {
    openModal(id);
  };

  const handleCloseModal = (id: string) => {
    closeModal(id);
  };

  return {
    execQuery,
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
    ConectionConfig,
    context,
  };
};

export const ActionsTypeDefinitions = `
declare function execQuery(query: string, context?: Record<string,any>): Promise<any[]>;
declare function openModal(id:string):void;
declare function closeModal(id:string):void;
declare const context:Context;
declare function ConectionConfig(config:{url:string,key:string,type:string}):void;
`;
