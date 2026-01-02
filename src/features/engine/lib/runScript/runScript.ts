import { useEditorStore } from "../../store/editor.store";
import { parseSqlScript } from "./parseSqlScript";
import { processSqlTemplate } from "./processSqlTemplate";

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

async function executeSafeScript(
  scriptCode: string,
  context: Record<string, any>,
  blockedList: string[]
) {
  let result;
  const allowedContext = {
    Math: Math,
    JSON: JSON,
    ...context,
  };
  try {
    const allowedKeys = Object.keys(allowedContext);
    const allowedValues = Object.values(allowedContext);
    const allArgNames = [...allowedKeys, ...blockedList];
    const allArgValues = [
      ...allowedValues,
      ...blockedList.map(() => undefined),
    ];
    const fn = new AsyncFunction(...allArgNames, scriptCode);
    result = await fn(...allArgValues);
  } catch (e: any) {
    useEditorStore.getState().addExecutionLogs([
      {
        message: "Error crítico de ejecución" + e.message,
      },
    ]);
  }

  return { result };
}

export async function runScript(
  jsScript: string,
  sqlScript: string,
  scriptContext?: Record<string, any>
) {
  const queries = parseSqlScript(sqlScript);

  const blockedList = [
    "fetch",
    "XMLHttpRequest",
    "setInterval",
    "globalThis",
    "eval",
    "Function",
    "document",
    "window",
    "console",
  ];

  const handleExecQuery = async (
    query: string,
    context: Record<string, string> = {}
  ) => {
    query = processSqlTemplate(query, context);
    return scriptContext?.execQuery ? await scriptContext.execQuery(query) : [];
  };

  const { result } = await executeSafeScript(
    jsScript,
    {
      execQuery: handleExecQuery,
      QUERIES: queries,
      ...scriptContext,
    },
    blockedList
  );

  return { result };
}

export { parseSqlScript };
