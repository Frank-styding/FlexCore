import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

interface ModalState {
  modals: Set<string>;
  openModals: string[];
  modalData: Record<string, any>;
  openModal: (id: string, data?: any) => void;
  closeModal: (id: string) => void;
  isOpen: (id: string) => boolean;
  registerModal: (id: string) => void;
  unRegisterModal: (id: string) => void;
  getModalData: (id: string) => any;
}

export const useModalStore = create<ModalState>((set, get) => ({
  modals: new Set(),
  openModals: [],
  modalData: {},
  isOpen: (id) => {
    return get().openModals.includes(id);
  },
  openModal: (id, data) => {
    set((state) => {
      // 2. Corrección: Evitar duplicados
      if (state.openModals.includes(id)) return state;

      return {
        ...state,
        openModals: [...state.openModals, id],
        // Guardamos la data asociada a este ID
        modalData: { ...state.modalData, [id]: data },
      };
    });
  },
  closeModal: (id) => {
    set((state) => {
      const newModalData = { ...state.modalData };
      delete newModalData[id];
      return {
        ...state,
        openModals: state.openModals.filter((i) => i !== id),
        modalData: newModalData,
      };
    });
  },
  registerModal: (id) =>
    set((state) => ({ ...state, modals: new Set(state.modals).add(id) })),

  unRegisterModal: (id) =>
    set((state) => {
      const modals = new Set(state.modals);
      modals.delete(id);
      return { ...state, modals };
    }),
  getModalData: (id) => {
    return get().modalData[id] || null;
  },
}));

export const useModalActions = () => {
  return useModalStore(
    useShallow((s) => ({
      openModal: s.openModal,
      closeModal: s.closeModal,
      registerModal: s.registerModal,
      unRegisterModal: s.unRegisterModal,
      getModalData: s.getModalData,
    }))
  );
};

export const useIsModalOpen = (id: string) => {
  return useModalStore((s) => s.openModals.includes(id));
};

export const useModalData = (id: string) => {
  // Esto hace una suscripción directa: si 'modalData[id]' cambia, el componente se actualiza.
  return useModalStore((s) => s.modalData[id]);
};
