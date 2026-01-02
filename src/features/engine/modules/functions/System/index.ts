import { IFunctionModule } from "../../types/IFuntionsModule";
import { System } from "./System";
import { SystemType } from "./SystemType";

export const SystemFun: IFunctionModule = {
  name: "sys",
  func: System,
  definition: SystemType,
};
