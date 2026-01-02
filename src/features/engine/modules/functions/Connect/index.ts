import { IFunctionModule } from "../../types/IFuntionsModule";
import { ConnectFunc as connect } from "./Connect";
import { ConnectType } from "./Connect.definition";

export const ConnectFunc: IFunctionModule = {
  name: "Connect",
  func: connect,
  definition: ConnectType,
};
