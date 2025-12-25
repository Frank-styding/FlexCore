import { useModals } from "@/components/providers/ModalProvider";

export const useScriptActions = () => {
  const { openModal, closeModal } = useModals();
  const execQuery = (query: string) => {
    console.log(query);
    return ["hola"];
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
  };
};

export const ActionsTypeDefinitions = `
declare function execQuery(query: string, context?: Record<string,any>): Promise<any[]>;
declare function openModal(id:string):void;
declare function closeModal(id:string):void;
`;
