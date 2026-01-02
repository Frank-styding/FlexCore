import { IComponentModule } from "../types/IComponentModule";
import { BUTTON } from "./button";
import { CONFIRM_MODAL } from "./confirmModal";
import { FORM } from "./form";
import { FORM_MODAL } from "./formModal";
import { FRAGMENT } from "./fragment";
import { GALLERY } from "./gallery";
import { LAYOUT } from "./layout";
import { LOADING_MODAL } from "./loadingModal";
import { NAVIGATION } from "./navigation";
import { TABLE } from "./table";
import { TEXT } from "./text";

export const ComponentModules: IComponentModule[] = [
  BUTTON,
  TEXT,
  LAYOUT,
  FRAGMENT,
  CONFIRM_MODAL,
  LOADING_MODAL,
  NAVIGATION,
  GALLERY,
  TABLE,
  FORM,
  FORM_MODAL,
];
