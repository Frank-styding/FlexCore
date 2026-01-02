import { ConnectFunc } from "../modules/functions/Connect/Connect";
import { useEditor } from "../store/useEditor";
import { createEngine, IEngine } from "../modules";
import { runScript as run } from "../lib/runScript/runScript";
import { useScriptConnection } from "../store/useScriptConnection";

export const useEngine = () => {
  const editor = useEditor();
  const connect = ConnectFunc();
  const scriptConnection = useScriptConnection();

  const runScript = async (
    jsCode: string,
    sqlCode: string,
    engine: IEngine
  ) => {
    return await run(jsCode, sqlCode, engine.globalContext);
  };

  return {
    ...scriptConnection,
    ...editor,
    connect,
    runScript,
    createEngine,
  };
};
