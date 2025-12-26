import { Button, ButtonType } from "./Button";
import { Layout, LayoutType } from "./Layout";
import { ConfirmModal, ConfirmModalType } from "./ConfirmModal";
import { ComponentType } from "./Component";

export const ComponentsBuilders = {
  Button,
  ConfirmModal,
  Layout,
};

/* export const ComponentBuildersTypes = new TypeBuilder()
  .addCustom(ComponentType)
  .addCustom(ButtonType)
  .addCustom(LayoutType)
  .addCustom(ConfirmModalType);
 */

export const ComponentTypes = [
  ComponentType,
  ButtonType,
  LayoutType,
  ConfirmModalType,
];
