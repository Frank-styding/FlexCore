import { IComponentModule } from "../../types/IComponentModule";
import { CText } from "./text.builder";
import { DynamicText } from "./text.component";
import { TEXT_CONTEXT_EVENT, TEXT_TYPE_DEFINITION } from "./text.definition";

export const TEXT: IComponentModule = {
  name: "CText",
  component: DynamicText,
  builder: CText,
  eventsDefinition: TEXT_CONTEXT_EVENT,
  builderDefinition: TEXT_TYPE_DEFINITION,
};
