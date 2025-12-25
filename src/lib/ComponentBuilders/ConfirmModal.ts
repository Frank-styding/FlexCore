import { BuildFuncs, Component, ComponentEvent } from "./Component";

type ConfirmModalConfig = {
  title?: string;
  description?: string;
  className?: string;
};

type ConfirmModal = (data: {
  id: string;
  config: ConfirmModalConfig;
  onConfirm: ComponentEvent;
  onCancel: ComponentEvent;
  buildFuncs: BuildFuncs;
}) => Component;

export const ConfirmModal: ConfirmModal = ({
  id,
  config,
  onConfirm,
  onCancel,
  buildFuncs,
}) => {
  return {
    id,
    type: "ConfirmModal",
    config,
    events: { onConfirm, onCancel },
    buildFuncs,
  };
};

export const ConfirmModalTypeDefinition = `

type ConfirmModalConfig = {
  title?: string;
  description?: string;
  className?: string;
};

type ConfirmModal = (data: {
  id: string;
  config: ConfirmModalConfig;
  onConfirm: ComponentEvent;
  onCancel: ComponentEvent;
  buildFuncs: BuildFuncs;
}) => Component;

declare const ConfirmModal:ConfirmModal;
`;
