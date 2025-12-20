/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useMemo,
} from "react";

// Estado: Qué modales existen, cuáles están abiertos y qué datos tienen
interface ModalState {
  registeredModals: Set<string>;
  openModals: string[];
  modalData: Record<string, any>; // <--- NUEVO: Almacena data por ID de modal
}

type ModalAction =
  | { type: "REGISTER"; id: string }
  | { type: "UNREGISTER"; id: string }
  | { type: "OPEN"; id: string; payload?: any } // <--- ACTUALIZADO: Acepta payload
  | { type: "CLOSE"; id: string }
  | { type: "CLOSE_ALL" };

const initialState: ModalState = {
  registeredModals: new Set(),
  openModals: [],
  modalData: {}, // Inicialmente vacío
};

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  switch (action.type) {
    case "REGISTER": {
      const newRegistry = new Set(state.registeredModals);
      newRegistry.add(action.id);
      return { ...state, registeredModals: newRegistry };
    }
    case "UNREGISTER": {
      const newRegistry = new Set(state.registeredModals);
      newRegistry.delete(action.id);

      // Limpiamos también la data si se desregistra
      const newModalData = { ...state.modalData };
      delete newModalData[action.id];

      return {
        ...state,
        registeredModals: newRegistry,
        openModals: state.openModals.filter((mid) => mid !== action.id),
        modalData: newModalData,
      };
    }
    case "OPEN": {
      if (!state.registeredModals.has(action.id)) {
        console.warn(`Intento de abrir modal no registrado: ${action.id}`);
        return state;
      }

      // Actualizamos la data siempre que se abre (o se re-abre con nueva data)
      const newModalData = { ...state.modalData };
      if (action.payload !== undefined) {
        newModalData[action.id] = action.payload;
      }

      // Si ya está abierto, solo actualizamos la data
      if (state.openModals.includes(action.id)) {
        return { ...state, modalData: newModalData };
      }

      return {
        ...state,
        openModals: [...state.openModals, action.id],
        modalData: newModalData,
      };
    }
    case "CLOSE": {
      // Opcional: ¿Quieres borrar la data al cerrar?
      // A veces es útil mantenerla para animaciones de salida.
      // Aquí decidimos mantenerla hasta que se sobrescriba o se desregistre.
      return {
        ...state,
        openModals: state.openModals.filter((mid) => mid !== action.id),
      };
    }
    case "CLOSE_ALL":
      return { ...state, openModals: [] };
    default:
      return state;
  }
};

interface ModalContextType {
  isModalOpen: (id: string) => boolean;
  openModal: <T = any>(id: string, data?: T) => void; // <--- ACTUALIZADO con genérico
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  registerModal: (id: string) => void;
  unregisterModal: (id: string) => void;
  getModalData: <T = any>(id: string) => T | undefined; // <--- NUEVO
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  const value = useMemo(
    () => ({
      isModalOpen: (id: string) => state.openModals.includes(id),

      // Ahora openModal acepta un segundo parámetro opcional
      openModal: <T = any,>(id: string, data?: T) =>
        dispatch({ type: "OPEN", id, payload: data }),

      closeModal: (id: string) => dispatch({ type: "CLOSE", id }),
      closeAllModals: () => dispatch({ type: "CLOSE_ALL" }),
      registerModal: (id: string) => dispatch({ type: "REGISTER", id }),
      unregisterModal: (id: string) => dispatch({ type: "UNREGISTER", id }),

      // Nueva función para recuperar la data
      getModalData: <T = any,>(id: string) => state.modalData[id] as T,
    }),
    [state.openModals, state.registeredModals, state.modalData]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModals = () => {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("useModals debe usarse dentro de ModalProvider");
  return context;
};
