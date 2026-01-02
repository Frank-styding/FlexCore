import { IComponentModule } from "../../types/IComponentModule";
import { Navigation } from "./navigation.builder";
import { DynamicNavigation } from "./navigation.component";
import {
  NAVIGATION_CONTEXT_EVENT,
  NAVIGATION_TYPE_DEFINITION,
} from "./navigation.definition";

export const NAVIGATION: IComponentModule = {
  name: "Navigation",
  component: DynamicNavigation,
  builder: Navigation,
  eventsDefinition: NAVIGATION_CONTEXT_EVENT,
  builderDefinition: NAVIGATION_TYPE_DEFINITION,
};
