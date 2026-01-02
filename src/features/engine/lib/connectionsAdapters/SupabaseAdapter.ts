import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { DatabaseAdapter, QueryResult } from "./types";

export class SupabaseAdapter implements DatabaseAdapter {
  id = "supabase";
  name = "Supabase Production";
  private client: SupabaseClient | null = null;
  private connected = false;

  async connect(config: { url: string; key: string }): Promise<void> {
    if (!config?.url || !config?.key) {
      throw new Error("Supabase URL y Key son requeridos para conectar.");
    }

    try {
      // 1. Inicializamos el cliente con las credenciales proporcionadas dinámicamente
      this.client = createClient(config.url, config.key, {
        auth: {
          persistSession: false,
          detectSessionInUrl: false,
          autoRefreshToken: false,
        },
      });

      // 2. "Ping" de validación: Intentamos una consulta simple para verificar credenciales
      // Nota: Esto asume que ya creaste la función RPC 'exec_sql' en tu base de datos.
      const { error } = await this.client.rpc("exec_sql", {
        sql_query: "SELECT 1",
      });

      if (error) throw error;

      this.connected = true;
    } catch (err: any) {
      this.connected = false;
      this.client = null;
      throw new Error(`Fallo al conectar: ${err.message}`);
    }
  }

  async disconnect(): Promise<void> {
    // Supabase js no requiere desconexión explícita (es stateless via HTTP),
    // pero limpiamos la referencia.
    this.client = null;
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected && this.client !== null;
  }

  async execute(query: string): Promise<QueryResult> {
    if (!this.client || !this.connected) {
      return { data: null, error: "No hay conexión establecida con Supabase" };
    }

    try {
      // Llamamos a la función RPC que permite ejecutar RAW SQL
      const { data, error } = await this.client.rpc("exec_sql", {
        sql_query: query,
      });

      if (error) throw error;

      // Lógica para interpretar la respuesta de nuestra función RPC customizada:

      // Caso 1: Error controlado devuelto por el SQL (dentro del JSON)
      if (data && !Array.isArray(data) && data.error) {
        return { data: null, error: data.error };
      }

      // Caso 2: Mensaje de éxito (INSERT/UPDATE/DELETE que devuelve objeto de status)
      if (data && !Array.isArray(data) && data.status === "success") {
        return {
          data: null,
          error: null,
          message: data.message || "Comando ejecutado exitosamente",
        };
      }

      // Caso 3: Array de datos (SELECT)
      return {
        data: Array.isArray(data) ? data : [], // Si es null (sin filas), devolvemos array vacío
        error: null,
        message: undefined,
      };
    } catch (err: any) {
      return { data: null, error: err.message || "Error al ejecutar consulta" };
    }
  }
}
