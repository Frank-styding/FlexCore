import { parseSqlScript } from "../../../engine/lib/runScript/runScript";

export class TypeBuilder {
  private definitions: string[] = [];

  constructor() {}

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

  addContext(contextVariables: Record<string, string>): this {
    const lines = Object.entries(contextVariables).map(
      ([key, type]) => `declare const ${key}: ${type};`
    );
    this.definitions.push(lines.join("\n"));
    return this;
  }

  addSqlQueries(sqlCode: string): this {
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
