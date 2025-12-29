import { BuildFuncs, Component, ComponentEvent, Context } from "./Component";

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
  context?: Context;
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
    subComponents: [],
    data: {},
  };
};

export const ConfirmModalType = `

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
  context?:Context;
}) => Component;

declare const ConfirmModal:ConfirmModal;
`;
