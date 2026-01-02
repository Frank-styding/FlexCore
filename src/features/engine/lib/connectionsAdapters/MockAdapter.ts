import { DatabaseAdapter, QueryResult } from "./types";

export class MockAdapter implements DatabaseAdapter {
  id = "mock";
  name = "Mock Local DB";
  private connected = false;

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async execute(query: string): Promise<QueryResult> {
    if (!this.connected) return { data: null, error: "Disconnected" };

    // Simulamos una respuesta basada en lo que escribas
    if (query.toLowerCase().includes("select")) {
      return {
        data: [
          { id: 1, name: "Mock User 1", role: "admin" },
          { id: 2, name: "Mock User 2", role: "user" },
        ],
        error: null,
      };
    }

    return { data: null, error: "Syntax Error: Mock DB solo soporta SELECT" };
  }
}
