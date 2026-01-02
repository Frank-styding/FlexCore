import { IFunctionModule } from "../../types/IFuntionsModule";
import { Modal } from "./Modal";
import { ModalType } from "./ModalType";

export const ModalFunc: IFunctionModule = {
  name: "modal",
  func: Modal,
  definition: ModalType,
};
