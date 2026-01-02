import { IFunctionModule } from "../../types/IFuntionsModule";
import { Zod } from "./Zod";
import { ZodType } from "./ZodType";

export const ZodFun: IFunctionModule = {
  name: "z",
  definition: ZodType,
  func: Zod,
};
