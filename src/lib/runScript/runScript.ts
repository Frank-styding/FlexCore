import { ComponentsBuilders } from "../ComponentBuilders/Builders";

export function parseSqlScript(text) {
  const regex = /--\[(.*?)\]([\s\S]*?)(?=(?:--\[|$))/g;
  const queries = {};
  let match;
  while ((match = regex.exec(text)) !== null) {
    const key = match[1].trim();
    const query = match[2].trim();
    queries[key] = query;
  }
  return queries as Record<string, string>;
}

export function processSqlTemplate(
  sql: string,
  variables: Record<string, any>
) {
  // Regex: Busca {{ seguido de cualquier espacio, captura el nombre, espacios y }}
  return sql.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, key) => {
    const varName = key.trim(); // Quitamos espacios extra: " parentId " -> "parentId"
    const value = variables[varName];

    // 1. Si no existe la variable, devolvemos NULL o dejamos el tag (tú decides)
    if (value === undefined) {
      console.warn(`Variable ${varName} no encontrada`);
      return "NULL";
    }

    // 2. Si es null
    if (value === null) return "NULL";

    // 3. Si es String, agregamos comillas simples para que sea SQL válido

    // 4. Si es Array (útil para IN (...)), los unimos por comas
    if (Array.isArray(value)) {
      return value.join(", ");
    }

    // 5. Números y booleanos se devuelven directos
    return String(value);
  });
}

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

export interface LogEntry {
  message: string;
  data?: any[]; // El '?' hace que la propiedad sea opcional
}

async function executeSafeScript(
  scriptCode: string,
  context: Record<string, any>,
  blockedList: string[]
) {
  const capturedLogs: LogEntry[] = [];
  /*  const realConsole = console; */

  const pushLog = (prefix, args) => {
    // 1. Lógica existente: Guardar para tu UI
    const entry: LogEntry = { message: "" };
    entry.data = args.filter((item) => typeof item != "string");
    entry.message = args.filter((item) => typeof item == "string").join(",");

    if (entry.data?.length == 0) {
      entry.data = undefined;
    }
    capturedLogs.push(entry);

    // 2. NUEVA LÓGICA: Imprimir en la consola real (DevTools)
    // Esto permite que los eventos onClick muestren output en el navegador
    /*     if (prefix === "[ERROR] ") {
      realConsole.error(...args);
    } else if (prefix === "[WARN] ") {
      realConsole.warn(...args);
    } else {
      realConsole.log(...args);
    } */
  };

  let result;
  const allowedContext = {
    Math: Math,
    JSON: JSON,
    console: {
      log: (...args) => pushLog("", args),
      warn: (...args) => pushLog("[WARN] ", args),
      error: (...args) => pushLog("[ERROR] ", args),
    },
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
    const logError = allowedContext.console
      ? allowedContext.console.error
      : console.error;
    logError("Error crítico de ejecución: " + e.message);
  }

  return { logs: capturedLogs, result };
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
  ];

  const handleExecQuery = async (
    query: string,
    context: Record<string, string> = {}
  ) => {
    query = processSqlTemplate(query, context);
    return scriptContext?.execQuery ? await scriptContext.execQuery(query) : [];
  };

  const { logs, result } = await executeSafeScript(
    jsScript,
    {
      execQuery: handleExecQuery,
      QUERIES: queries,
      ...ComponentsBuilders,
      ...scriptContext,
    },
    blockedList
  );

  return { logs, result };
}
