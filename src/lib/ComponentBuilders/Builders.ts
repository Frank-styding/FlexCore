import { Button, ButtonTypeDefinition } from "./Button";
import { Layout, LayoutTypeDefinition } from "./Layout";
import { ConfirmModal, ConfirmModalTypeDefinition } from "./ConfirmModal";

export const ComponentsBuilders = {
  Button,
  ConfirmModal,
  Layout,
};

export const ComponentsTypeDefinition = `${ButtonTypeDefinition}
${ConfirmModalTypeDefinition}
${LayoutTypeDefinition}
`;
