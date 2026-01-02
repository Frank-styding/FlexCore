import { IComponentModule } from "../../types/IComponentModule";
import { FormModal } from "./form-modal.builder";
import { DynamicFormModal } from "./form-modal.component";
import {
  FORM_MODAL_CONTEXT_EVENT,
  FORM_MODAL_TYPE_DEFINITION,
} from "./form-modal.definition";

export const FORM_MODAL: IComponentModule = {
  name: "FormModal",
  component: DynamicFormModal,
  builder: FormModal,
  eventsDefinition: FORM_MODAL_CONTEXT_EVENT,
  builderDefinition: FORM_MODAL_TYPE_DEFINITION,
};
