import { IFunctionModule } from "../../types/IFuntionsModule";
import { EditorLog } from "./EditorLog";
import { EditorLogType } from "./EditorLog.definition";

export const EditorLogFun: IFunctionModule = {
  name: "Log",
  func: EditorLog,
  definition: EditorLogType,
};
