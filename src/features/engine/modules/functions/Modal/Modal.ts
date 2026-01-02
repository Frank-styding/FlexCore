import { useModalStore } from "@/hooks/useModal";

export const Modal = () => {
  const { openModal, closeModal, getModalData } = useModalStore.getState();
  return {
    open: (id: string, data: any) => openModal(id, data),
    close: (id: string) => closeModal(id),
    getData: (id: string) => getModalData(id),
  };
};
