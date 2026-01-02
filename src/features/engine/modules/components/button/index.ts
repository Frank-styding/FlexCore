import { IComponentModule } from "../../types/IComponentModule";
import { Button } from "./button.builder";
import { DynamicButton } from "./button.component";
import {
  BUTTON_CONTEXT_EVENT,
  BUTTON_TYPE_DEFINITION,
} from "./button.definition";

export const BUTTON: IComponentModule = {
  name: "Button",
  builder: Button,
  component: DynamicButton,
  eventsDefinition: BUTTON_CONTEXT_EVENT,
  builderDefinition: BUTTON_TYPE_DEFINITION,
};
