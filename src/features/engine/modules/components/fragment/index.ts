import { IComponentModule } from "../../types/IComponentModule";
import { Fragment } from "./fragment.builder";
import { DynamicFragment } from "./fragment.component";
import {
  FRAGMENT_CONTEXT_EVENT,
  FRAGMENT_TYPE_DEFINITION,
} from "./fragment.definition";

export const FRAGMENT: IComponentModule = {
  name: "Fragment",
  component: DynamicFragment,
  builder: Fragment,
  eventsDefinition: FRAGMENT_CONTEXT_EVENT,
  builderDefinition: FRAGMENT_TYPE_DEFINITION,
};
