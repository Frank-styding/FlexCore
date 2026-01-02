import { IComponentModule } from "../../types/IComponentModule";
import { ConfirmModal } from "./confirm-modal.builder";
import { DynamicConfirmModal } from "./confirm-modal.component";
import {
  CONFIRM_MODAL_CONTEXT_EVENT,
  CONFIRM_MODAL_TYPE_DEFINITION,
} from "./confirm-modal.definition";

export const CONFIRM_MODAL: IComponentModule = {
  name: "ConfirmModal",
  component: DynamicConfirmModal,
  builder: ConfirmModal,
  eventsDefinition: CONFIRM_MODAL_CONTEXT_EVENT,
  builderDefinition: CONFIRM_MODAL_TYPE_DEFINITION,
};
