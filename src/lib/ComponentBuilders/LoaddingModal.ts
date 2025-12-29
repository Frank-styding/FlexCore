import { Component, ComponentEvent, Context } from "./Component";

// 1. Configuración
type LoadingModalConfig = {
  className?: string;
  title?: string;
  description?: string;
  disableEscape?: boolean;
  disableOutside?: boolean;
};

interface LoadingModalProps {
  id: string;
  config?: LoadingModalConfig;
  onOpen?: ComponentEvent;
  onClose?: ComponentEvent;
  context?: Context;
}
type LoadingModalFactory = (data: LoadingModalProps) => Component;

// 3. Factory
export const LoadingModal: LoadingModalFactory = ({
  id,
  config,
  context,
  onOpen,
  onClose,
}) => {
  return {
    id,
    type: "LoadingModal", // Asegúrate de registrar este string en tu mapa de componentes principal
    context,
    data: {},
    config: config ?? {},
    events: { onOpen, onClose },
  };
};

// 4. Tipos para el Editor
export const LoadingModalType = `


type LoadingModalConfig = {
  className?: string;
  title?:string;
  description?:string;
  disableEscape?:boolean;
  disableOutside?:boolean;
};

interface LoadingModalProps {
  id: string;
  config?: LoadingModalConfig;
  onOpen?:ComponentEvent;
  onClose?:ComponentEvent;
  context?: Context;
}

interface LoadingModalFactory {
  (data: LoadingModalProps): Component;
}

declare const LoadingModal: LoadingModalFactory;
`;
