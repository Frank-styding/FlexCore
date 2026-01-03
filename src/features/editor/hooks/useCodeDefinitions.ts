import { useMemo } from "react";
import { TypeBuilder } from "../lib/monaco/TypeBuilder";
import { IEngine } from "@/features/engine/modules";

// Definimos la interfaz de lo que devuelve para evitar 'any'
interface IMonacoDefinition {
  path: string;
  content: string;
}

export const useCodeDefinitions = ({
  sqlCode,
  engine,
}: {
  sqlCode?: string;
  engine?: IEngine | null;
}) => {
  const definitions = useMemo(() => {
    const defs: IMonacoDefinition[] = [];

    // 1. Engine Context (Globales)
    if (engine) {
      const globalBuilder = new TypeBuilder();

      // Asumo que ModulesDefinition es compatible con addCustom
      globalBuilder.addCustom(engine.ModulesDefinition);

      defs.push({
        // Recomendación: Usa prefijos de archivo para evitar colisiones en Monaco
        path: "file:///globals.d.ts",
        content: globalBuilder.build(),
      });

      // ❌ ELIMINADO: return defs;
      // Queremos que el código siga fluyendo hacia abajo
    }

    // 2. SQL Context (Dinámico)
    if (sqlCode) {
      const sqlBuilder = new TypeBuilder(); // Instancia separada o encadenada según tu clase
      sqlBuilder.addSqlQueries(sqlCode);
      defs.push({
        path: "file:///sql-generated.d.ts",
        content: sqlBuilder.build(),
      });
    }
    // 3. Retorno final con todo acumulado
    return defs;
  }, [sqlCode, engine]);

  return { definitions };
};
