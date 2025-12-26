import { useMemo } from "react";
import { TypeBuilder } from "@/lib/monaco/TypeBuilder";
import { ActionsTypes } from "@/hooks/useScriptActions";
import { ComponentTypes } from "@/lib/ComponentBuilders/Builders";
import { ConnectionActionsTypes } from "./useScriptConnectionActions";

export const useCodeDefinitions = ({
  sqlCode,
  contextType = "default",
}: {
  sqlCode?: string;
  contextType?: "default" | "DBConfig";
}) => {
  const definitions = useMemo(() => {
    const defs: any[] = [];

    if (contextType == "DBConfig") {
      const globalBuilder = new TypeBuilder().addCustom(ConnectionActionsTypes);
      defs.push({
        path: "globals.d.ts",
        content: globalBuilder.build(),
      });
      return defs;
    }

    // 1. Core Libs (Siempre presentes)
    const coreBuilder = new TypeBuilder().addCore();
    defs.push({
      path: "core.d.ts",
      content: coreBuilder.build(),
    });

    // 2. Global Libs (Tus acciones, Componentes, etc)
    const globalBuilder = new TypeBuilder()
      .addCustom(ActionsTypes)
      .addCustom(ComponentTypes);

    defs.push({
      path: "globals.d.ts",
      content: globalBuilder.build(),
    });

    // 3. SQL Context (Dinámico)
    if (sqlCode) {
      const sqlBuilder = new TypeBuilder().addSqlQueries(sqlCode);
      defs.push({
        path: "sql-generated.d.ts",
        content: sqlBuilder.build(),
      });
    }

    return defs;
  }, [sqlCode, contextType]);

  return { definitions };
};
