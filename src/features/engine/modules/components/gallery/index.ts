import { IComponentModule } from "../../types/IComponentModule";
import { Gallery } from "./gallery.builder";
import { DynamicGallery } from "./gallery.component";
import {
  GALLERY_CONTEXT_EVENT,
  GALLERY_TYPE_DEFINITION,
} from "./gallery.definition";

export const GALLERY: IComponentModule = {
  name: "Gallery",
  component: DynamicGallery,
  builder: Gallery,
  eventsDefinition: GALLERY_CONTEXT_EVENT,
  builderDefinition: GALLERY_TYPE_DEFINITION,
};
