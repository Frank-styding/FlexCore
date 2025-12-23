// src/context/DatabaseContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DatabaseAdapter, QueryResult } from "@/lib/db-adapters/types";
import { SupabaseAdapter } from "@/lib/db-adapters/SupabaseAdapter";
import { MockAdapter } from "@/lib/db-adapters/MockAdapter";

// Registro de adaptadores disponibles
const ADAPTERS: Record<string, () => DatabaseAdapter> = {
  supabase: () => new SupabaseAdapter(),
  mock: () => new MockAdapter(),
  // sqlite: () => new SqlJsAdapter(), // Aquí iría el de SQL.js si lo integras
};

interface DatabaseContextType {
  adapter: DatabaseAdapter | null;
  isLoading: boolean;
  activeAdapterId: string;
  connectTo: (adapterId: string) => Promise<void>;
  executeQuery: (query: string) => Promise<QueryResult>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [adapter, setAdapter] = useState<DatabaseAdapter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAdapterId, setActiveAdapterId] = useState<string>("");

  const connectTo = async (adapterId: string) => {
    setIsLoading(true);
    try {
      // 1. Desconectar el anterior si existe
      if (adapter) {
        await adapter.disconnect();
      }

      // 2. Instanciar el nuevo
      const createAdapter = ADAPTERS[adapterId];
      if (!createAdapter)
        throw new Error(`Adaptador ${adapterId} no encontrado`);

      const newAdapter = createAdapter();

      // 3. Conectar
      await newAdapter.connect();

      // 4. Actualizar estado
      setAdapter(newAdapter);
      setActiveAdapterId(adapterId);
    } catch (error) {
      console.error("Error al cambiar de base de datos:", error);
      alert("Error conectando a la base de datos");
    } finally {
      setIsLoading(false);
    }
  };

  const executeQuery = async (query: string): Promise<QueryResult> => {
    if (!adapter) {
      return { data: null, error: "No hay base de datos seleccionada" };
    }
    return await adapter.execute(query);
  };

  return (
    <DatabaseContext.Provider
      value={{ adapter, isLoading, activeAdapterId, connectTo, executeQuery }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context)
    throw new Error("useDatabase debe usarse dentro de DatabaseProvider");
  return context;
};
