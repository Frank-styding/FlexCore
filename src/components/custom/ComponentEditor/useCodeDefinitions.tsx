import { ActionsTypeDefinitions } from "@/hooks/useScriptActions";
import { ComponentsTypeDefinition } from "@/lib/ComponentBuilders/Builders";
import { ComponentTypeDefinition } from "@/lib/ComponentBuilders/Component";
import { parseSqlScript } from "@/lib/runScript/runScript";
import { useMemo } from "react";

export const useCodeDefinitions = ({ sqlCode }: { sqlCode?: string }) => {
  const globalDefinitions = useMemo(() => {
    return `
      /** Ejecuta una consulta SQL */

      type Context = Record<string, any>;
      type ComponentEvent = (e: any, context: Context) => void;
      type Events = Record<string, ComponentEvent>;
      interface BuildFuncs {
         init?: () => Context;
         update?: () => Context;
      }

      interface Component {
        id:string;
        type: string;
        config: Record<string, any>;
        events: Events;
        buildFuncs: BuildFuncs;
        subComponents?: Component[] | Component;
      }
      declare const console: {
        log(...args: any[]): void;
        warn(...args: any[]): void;
        error(...args: any[]): void;
      };
      
      declare const context: Record<string, any>;
      ${ActionsTypeDefinitions}
      ${ComponentTypeDefinition}
      ${ComponentsTypeDefinition}
    `;
  }, []); // Array vacío: Solo se calcula una vez

  const sqlDefinitions = useMemo(() => {
    if (!sqlCode) return "";
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
