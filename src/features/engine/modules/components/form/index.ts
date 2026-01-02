import { IComponentModule } from "../../types/IComponentModule";
import { Form } from "./form.builder";
import { DynamicFormComponent } from "./form.component";
import { FORM_CONTEXT_EVENT, FORM_TYPE_DEFINITION } from "./form.definition";

export const FORM: IComponentModule = {
  name: "Form",
  component: DynamicFormComponent,
  builder: Form,
  eventsDefinition: FORM_CONTEXT_EVENT,
  builderDefinition: FORM_TYPE_DEFINITION,
};
