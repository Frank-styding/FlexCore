import { useDashboards } from "./useDashboards";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addExecutionLogs } from "@/lib/redux/features/ScriptEditorSlice";

export const useScriptConnectionActions = () => {
  const { setConfig } = useDashboards();

  const dispatch = useAppDispatch();
  const execQuery = (query: string) => {
    return ["hola"];
  };

  const ConectionConfig = (config: {
    url: string;
    key: string;
    type: string;
  }) => {
    dispatch(
      addExecutionLogs({
        logs: [
          { message: "System: Connected to " + config.url, data: [config] },
        ],
      })
    );
    setConfig(config);
  };

  return {
    execQuery,
    ConectionConfig,
  };
};

export const ConnectionActionsTypes = `
declare function execQuery(query: string, context?: Record<string,any>): Promise<any[]>;
declare function ConectionConfig(config:{url:string,key:string,type:string}):void;
`;
