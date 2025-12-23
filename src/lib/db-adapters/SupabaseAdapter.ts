// src/lib/db-adapters/SupabaseAdapter.ts
import { DatabaseAdapter, QueryResult } from "./types";

export class SupabaseAdapter implements DatabaseAdapter {
  id = "supabase";
  name = "Supabase Production";
  private connected = false;

  async connect(): Promise<void> {
    // Aquí podrías validar un token o hacer un ping a la base de datos
    console.log("Conectando a Supabase...");
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simula latencia
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async execute(query: string): Promise<QueryResult> {
    if (!this.connected) {
      return { data: null, error: "No hay conexión establecida con Supabase" };
    }

    try {
      const response = await fetch("/api/execute-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const json = await response.json();

      if (!response.ok) throw new Error(json.error || "Error desconocido");

      return {
        data: json.result,
        error: null,
        message: json.result?.length
          ? undefined
          : "Comando ejecutado exitosamente",
      };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  }
}
