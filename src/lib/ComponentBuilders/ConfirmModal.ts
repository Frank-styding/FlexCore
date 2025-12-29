import { Component, ComponentEvent, Context } from "./Component";

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
  context?: Context;
}) => Component;

export const ConfirmModal: ConfirmModal = ({
  id,
  config,
  onConfirm,
  onCancel,
}) => {
  return {
    id,
    type: "ConfirmModal",
    config,
    events: { onConfirm, onCancel },
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
  context?:Context;
}) => Component;

declare const ConfirmModal:ConfirmModal;
`;
