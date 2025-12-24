import { parseSqlScript } from "@/lib/runScript/runScript";
import { useMemo } from "react";

export const useCodeDefinitions = ({
  sqlCode,
  initDefinitions,
}: {
  sqlCode: string;
  initDefinitions: string;
}) => {
  const globalDefinitions = useMemo(() => {
    return `
      /** Ejecuta una consulta SQL */
      declare function execQuery(query: string, context?: Record<string,any>): Promise<any[]>;
      declare const console: {
        log(...args: any[]): void;
        warn(...args: any[]): void;
        error(...args: any[]): void;
      };
      
      declare const context: Record<string, any>;
    ${initDefinitions}
    `;
  }, []); // Array vacío: Solo se calcula una vez

  const sqlDefinitions = useMemo(() => {
    const queries = parseSqlScript(sqlCode);
    const queryKeys = Object.keys(queries);

    const queriesObjProperties = queryKeys
      .map(
        (k) =>
          `  /** Query: ${queries[k].substring(
            0,
            30
          )}... */\n  ${JSON.stringify(k)}: string;`
      )
      .join("\n");

    return `
      /**
       * Objeto generado automáticamente desde tu pestaña SQL.
       * Contiene las llaves de tus consultas.
       */
      declare const QUERIES: {
      ${queriesObjProperties}
      };
    `;
  }, [sqlCode]);

  return { globalDefinitions, sqlDefinitions };
};
