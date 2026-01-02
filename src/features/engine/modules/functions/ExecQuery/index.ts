import { IFunctionModule } from "../../types/IFuntionsModule";
import { ExecQuery } from "./ExecQuery";
import { ExecQueryType } from "./ExecQuery.definition";

export const ExecQueryFun: IFunctionModule = {
  name: "execQuery",
  func: ExecQuery,
  definition: ExecQueryType,
};
