"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useMemo,
  useRef,
} from "react";

// 1. EL ESTADO DE REACT SOLO MANEJA VISIBILIDAD Y REGISTRO (UI)
interface ModalState {
  registeredModals: Set<string>;
  openModals: string[];
  // Ya no guardamos la data aquí para evitar problemas de asincronía
}

type ModalAction =
  | { type: "REGISTER"; id: string }
  | { type: "UNREGISTER"; id: string }
  | { type: "OPEN"; id: string } // OPEN ya no necesita payload en el reducer
  | { type: "CLOSE"; id: string }
  | { type: "CLOSE_ALL" };

const initialState: ModalState = {
  registeredModals: new Set(),
  openModals: [],
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
      return {
        ...state,
        registeredModals: newRegistry,
        openModals: state.openModals.filter((mid) => mid !== action.id),
      };
    }
    case "OPEN": {
      if (!state.registeredModals.has(action.id)) {
        console.warn(`Intento de abrir modal no registrado: ${action.id}`);
        return state;
      }
      // Solo actualizamos si no estaba abierto ya, para evitar re-renders innecesarios
      if (state.openModals.includes(action.id)) {
        return state;
      }
      return {
        ...state,
        openModals: [...state.openModals, action.id],
      };
    }
    case "CLOSE": {
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
  openModal: <T = any>(id: string, data?: T) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  registerModal: (id: string) => void;
  unregisterModal: (id: string) => void;
  getModalData: <T = any>(id: string) => T | undefined;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  // 2. EL REF SE ENCARGA EXCLUSIVAMENTE DE LOS DATOS
  // Esto permite acceso síncrono inmediato (Write -> Read en la misma ejecución)
  const modalDataRef = useRef<Record<string, any>>({});

  const value = useMemo(
    () => ({
      isModalOpen: (id: string) => state.openModals.includes(id),

      openModal: <T = any,>(id: string, data?: T) => {
        // A. Guardamos la data en el Ref (Síncrono e Inmediato)
        if (data !== undefined) {
          modalDataRef.current[id] = data;
        }

        // B. Avisamos a React para que muestre el modal (Asíncrono)
        dispatch({ type: "OPEN", id });
      },

      closeModal: (id: string) => {
        // Opcional: ¿Quieres limpiar la data al cerrar?
        // Si no, la dejas ahí para persistencia.
        // delete modalDataRef.current[id];
        dispatch({ type: "CLOSE", id });
      },

      closeAllModals: () => {
        dispatch({ type: "CLOSE_ALL" });
      },

      registerModal: (id: string) => dispatch({ type: "REGISTER", id }),

      unregisterModal: (id: string) => {
        // Limpieza de memoria al destruir el modal
        delete modalDataRef.current[id];
        dispatch({ type: "UNREGISTER", id });
      },

      // LECTURA SÍNCRONA DIRECTA
      getModalData: <T = any,>(id: string) => {
        return modalDataRef.current[id] as T;
      },
    }),
    [state.openModals, state.registeredModals] // Dependencias solo de UI
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
