"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Play, Trash2, Terminal, BrushCleaning } from "lucide-react";
import { Button } from "@/components/ui/button";
// Importamos solo el tipo, no la lógica completa para evitar errores de build
import type { Database, SqlJsStatic } from "sql.js";
import {
  SelectContent,
  SelectItem,
  Select,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useDatabase } from "../providers/DatabaseProvider";
/* import initSqlJs from "sql.js"; */

// --- Componente de Consola Visual (Igual que antes) ---
const ConsoleOutput = ({
  logs,
}: {
  logs: { type: "info" | "error" | "result"; message: string }[];
}) => (
  <div className="flex flex-col h-40 bg-black text-xs font-mono rounded-b-md border-t border-border">
    <div className="flex items-center justify-between px-3 py-1 bg-muted/50 text-muted-foreground border-b border-border">
      <span className="flex items-center gap-2">
        <Terminal className="w-3 h-3" /> Console
      </span>
    </div>
    <div className="flex-1 overflow-auto p-3 space-y-1">
      {logs.length === 0 ? (
        <span className="text-gray-600 italic">...esperando ejecución</span>
      ) : (
        logs.map((log, i) => (
          <div
            key={i}
            className={
              log.type === "error"
                ? "text-red-400"
                : log.type === "result"
                ? "text-green-400"
                : "text-gray-300"
            }
          >
            <span className="opacity-50 mr-2">[{log.type.toUpperCase()}]</span>
            {log.message}
          </div>
        ))
      )}
    </div>
  </div>
);

// --- Lógica del Playground ---
interface CodePlaygroundProps {
  language: "javascript" | "sql";
  initialCode: string;
}

export const CodePlayground = ({
  language,
  initialCode,
}: CodePlaygroundProps) => {
  const [code, setCode] = useState(initialCode);
  const [logs, setLogs] = useState<any[]>([]);

  // USAMOS EL CONTEXTO
  const { executeQuery, connectTo, activeAdapterId, isLoading } = useDatabase();

  const runCode = async () => {
    setLogs([]); // Limpiar

    if (language === "sql") {
      // Si no hay adaptador seleccionado, forzamos uno por defecto o avisamos
      if (!activeAdapterId) {
        setLogs([
          {
            type: "error",
            message:
              "Selecciona una base de datos primero (arriba a la derecha)",
          },
        ]);
        return;
      }

      const { data, error, message } = await executeQuery(code);

      if (error) {
        setLogs((prev) => [...prev, { type: "error", message: error }]);
      } else if (data) {
        setLogs((prev) => [
          ...prev,
          { type: "result", message: JSON.stringify(data, null, 2) },
        ]);
      } else if (message) {
        setLogs((prev) => [...prev, { type: "info", message: message }]);
      }
    }
    try {
      if (language === "javascript") {
        const capturedLogs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) =>
          capturedLogs.push(args.map((a) => JSON.stringify(a)).join(" "));

        // Ejecutar JS
        const result = new Function(code)();

        console.log = originalLog;
        capturedLogs.forEach((log) =>
          setLogs((prev) => [...prev, { type: "info", message: log }])
        );
        if (result !== undefined) {
          setLogs((prev) => [
            ...prev,
            { type: "result", message: `Return: ${JSON.stringify(result)}` },
          ]);
        }
      }
    } catch (err: any) {
      setLogs((prev) => [...prev, { type: "error", message: err.message }]);
    }
  };

  return (
    <div className="grid grid-rows-[40px_1fr_160px] border rounded-md bg-background ">
      {/* HEADER MEJORADO CON SELECTOR DE BD */}
      <div className="flex justify-between items-center px-2 bg-muted/30 border-b">
        <div className="flex gap-4 items-center">
          <span className="text-xs font-semibold text-muted-foreground uppercase pl-2">
            {language}
          </span>

          {/* SOLO MOSTRAMOS EL SELECTOR SI ESTAMOS EN MODO SQL */}
          {language === "sql" && (
            <Select value={activeAdapterId} onValueChange={connectTo}>
              <SelectTrigger className="w-[180px] h-7 text-xs">
                <SelectValue placeholder="Conectar a..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supabase">Production (Supabase)</SelectItem>
                <SelectItem value="mock">Testing (Mock Local)</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex gap-2">
          {/* Botones de ejecutar... */}
          <Button onClick={runCode} disabled={isLoading}>
            {isLoading ? "Conectando..." : "Run"}
          </Button>
        </div>
      </div>

      <div className="min-h-[37vh]">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={code}
          onChange={(val) => setCode(val || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            padding: { top: 10 },
          }}
        />
      </div>

      <ConsoleOutput logs={logs} />
    </div>
  );
};
