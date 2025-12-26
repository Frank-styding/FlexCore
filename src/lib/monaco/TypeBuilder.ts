// lib/monaco/TypeBuilder.ts

import { parseSqlScript } from "../runScript/runScript";

export class TypeBuilder {
  private definitions: string[] = [];

  constructor() {}

  /** Agrega definiciones básicas de JS (Console, Math, JSON básico si noLib: true) */
  addCore(): this {
    this.definitions.push(`
      declare const console: {
        log(...args: any[]): void;
        warn(...args: any[]): void;
        error(...args: any[]): void;
      };
      declare const Math: any;
      declare const JSON: any;
    `);
    return this;
  }

  /** Agrega definiciones para un contexto de ejecución específico */
  addContext(contextVariables: Record<string, string>): this {
    const lines = Object.entries(contextVariables).map(
      ([key, type]) => `declare const ${key}: ${type};`
    );
    this.definitions.push(lines.join("\n"));
    return this;
  }

  /** Agrega las Queries SQL dinámicamente */
  addSqlQueries(sqlCode: string): this {
    // Aquí usarías tu parseSqlScript
    // Simulación para el ejemplo:
    // const queries = ["getItems", "updateUser"];
    const queries = Object.keys(parseSqlScript(sqlCode));

    const queryProps = queries.map((q) => `  "${q}": string;`).join("\n");

    this.definitions.push(`
       /** Consultas extraídas automáticamente de tu SQL */
       declare const QUERIES: {
         ${queryProps}
       };
     `);
    return this;
  }

  /** Agrega definiciones personalizadas desde un string */
  addCustom(definition: string | string[]): this {
    if (typeof definition == "string") {
      this.definitions.push(definition);
    } else {
      this.definitions.push(...definition);
    }
    return this;
  }

  build(): string {
    return this.definitions.join("\n\n");
  }
}
