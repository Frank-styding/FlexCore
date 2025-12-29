import { BuildFuncs, Component, Context } from "./Component";

// 1. Configuración
type LoadingModalConfig = {
  className?: string;
};

type LoadingModalData = {
  id: string;
  config?: LoadingModalConfig;
  buildFuncs: BuildFuncs;
  context?: Context;
};

type LoadingModalFactory = (data: LoadingModalData) => Component;

// 3. Factory
export const LoadingModal: LoadingModalFactory = ({
  id,
  config,
  buildFuncs,
  context,
}) => {
  return {
    id,
    type: "LoadingModal", // Asegúrate de registrar este string en tu mapa de componentes principal
    context,
    data: {},
    config: config ?? {},
    events: {},
    buildFuncs,
  };
};

// 4. Tipos para el Editor
export const LoadingModalType = `
type LoadingModalConfig = {
  className?: string;
};

interface LoadingModalProps {
  id: string;
  config?: LoadingModalConfig;
  buildFuncs?: BuildFuncs;
  context?: Context;
}

interface LoadingModalFactory {
  (data: LoadingModalProps): Component;
}

declare const LoadingModal: LoadingModalFactory;
`;
