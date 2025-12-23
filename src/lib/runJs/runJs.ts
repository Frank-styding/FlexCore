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

interface LogEntry {
  message: string;
  data?: any[]; // El '?' hace que la propiedad sea opcional
}

function executeSafeScript(
  scriptCode: string,
  context: Record<string, any>,
  blockedList: string[]
) {
  const capturedLogs: LogEntry[] = [];
  const pushLog = (prefix, args) => {
    const entry: LogEntry = { message: prefix + args.join(" ") };
    // Solo agregamos la propiedad 'data' si hay argumentos
    entry.data = args.filter((item) => typeof item != "string");

    if (entry.data?.length == 0) {
      entry.data = undefined;
    }

    capturedLogs.push(entry);
  };

  let result;
  const allowedContext = {
    console: {
      log: (...args) => pushLog("", args),
      warn: (...args) => pushLog("[WARN] ", args),
      error: (...args) => pushLog("[ERROR] ", args),
    },
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
    const fn = new Function(...allArgNames, scriptCode);
    result = fn(...allArgValues);
  } catch (e: any) {
    const logError = allowedContext.console
      ? allowedContext.console.error
      : console.error;
    logError("Error crítico de ejecución: " + e.message);
  }

  return { logs: capturedLogs, result };
}

export function runJs(jsScript: string, sqlScript: string) {
  const queries = parseSqlScript(sqlScript);

  const blockedList = [
    "fetch",
    "XMLHttpRequest",
    "setTimeout",
    "setInterval",
    "globalThis",
    "eval",
    "Function",
  ];

  const execQuery = (query: string, context: Record<string, string> = {}) => {
    query = processSqlTemplate(query, context);
    console.log(query, context);
    return ["hola", "hola"];
  };

  const { logs, result } = executeSafeScript(
    jsScript,
    { execQuery, QUERIES: queries },
    blockedList
  );

  return { logs, result };
}
