// src/lib/db-adapters/types.ts

export interface QueryResult {
  data: any[] | null;
  error: string | null;
  message?: string; // Para mensajes de éxito como "Table created"
}

// Interfaz que todos los adaptadores deben cumplir
export interface DatabaseAdapter {
  id: string; // 'supabase', 'local', 'mock'
  name: string; // Nombre legible

  // Conectar (puede recibir credenciales o config)
  connect(config?: any): Promise<void>;

  // Desconectar
  disconnect(): Promise<void>;

  // Ejecutar query
  execute(query: string): Promise<QueryResult>;

  // Verificar estado
  isConnected(): boolean;
}
