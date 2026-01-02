import { IComponentModule } from "../../types/IComponentModule";
import { LoadingModal } from "./loading-modal.builder";
import { DynamicLoadingModal } from "./loading-modal.component";
import {
  LOADING_MODAL_CONTEXT_EVENT,
  LOADING_MODAL_TYPE_DEFINITION,
} from "./loading-modal.definition";

export const LOADING_MODAL: IComponentModule = {
  name: "LoadingModal",
  component: DynamicLoadingModal,
  builder: LoadingModal,
  eventsDefinition: LOADING_MODAL_CONTEXT_EVENT,
  builderDefinition: LOADING_MODAL_TYPE_DEFINITION,
};
