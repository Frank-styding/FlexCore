import { IComponentModule } from "../../types/IComponentModule";
import { Layout } from "./layout.builder";
import { DynamicLayout } from "./layout.component";
import {
  LAYOUT_CONTEXT_EVENT,
  LAYOUT_TYPE_DEFINITION,
} from "./layout.definition";

export const LAYOUT: IComponentModule = {
  name: "Layout",
  component: DynamicLayout,
  builder: Layout,
  eventsDefinition: LAYOUT_CONTEXT_EVENT,
  builderDefinition: LAYOUT_TYPE_DEFINITION,
};
