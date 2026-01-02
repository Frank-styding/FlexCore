import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Search,
  ArrowDownToLine,
  Ban,
} from "lucide-react";
import { useEffect, useRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils"; // Asegúrate de tener esta utilidad de shadcn, si no, usa template strings

// Interfaces
export interface ILog {
  message: string;
  data?: any;
  type?: "info" | "error" | "success" | "warning"; // Nuevo campo opcional
  timestamp?: number;
}

// Sub-componente para visualizar JSON con botón de copiar
const JsonViewer = ({ data }: { data: any }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mt-1">
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 bg-muted/50 hover:bg-muted"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </Button>
      </div>
      <pre className="text-[10px] leading-tight text-muted-foreground bg-black/20 p-2 rounded-md overflow-x-auto border border-border/30">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

// Componente de fila individual memoizado
const LogItem = ({ log }: { log: ILog }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Determinar color basado en el mensaje o tipo
  const getLogStyle = () => {
    const msg = log.message.toLowerCase();
    if (log.type === "error" || msg.includes("error") || msg.includes("fail"))
      return "text-red-400 border-l-2 border-red-500 bg-red-500/5";
    if (
      log.type === "success" ||
      msg.includes("success") ||
      msg.includes("done")
    )
      return "text-green-400 border-l-2 border-green-500 bg-green-500/5";
    if (log.type === "warning" || msg.includes("warn"))
      return "text-yellow-400 border-l-2 border-yellow-500 bg-yellow-500/5";
    return "text-blue-300 border-l-2 border-transparent hover:bg-white/5";
  };

  // Normalizar data a array
  const dataItems = useMemo(() => {
    if (!log.data) return [];
    const d = Array.isArray(log.data) ? log.data : [log.data];
    return d.filter(Boolean); // Eliminar nulls/undefined
  }, [log.data]);

  const hasData = dataItems.length > 0;
  const time = log.timestamp
    ? new Date(log.timestamp).toLocaleTimeString()
    : new Date().toLocaleTimeString();

  return (
    <div
      className={cn(
        "py-1 px-2 mb-[1px] text-xs font-mono transition-colors",
        getLogStyle()
      )}
    >
      <div className="flex items-start gap-2">
        <span className="text-gray-600 select-none shrink-0 text-[10px] mt-[2px]">
          {time}
        </span>

        <div className="flex-1 min-w-0">
          <div
            className="flex items-center gap-1 cursor-pointer group"
            onClick={() => hasData && setIsExpanded(!isExpanded)}
          >
            {hasData && (
              <span className="text-muted-foreground">
                {isExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </span>
            )}
            <span className="font-semibold break-all">
              {log.message || "Log entry"}
            </span>
          </div>

          {isExpanded && hasData && (
            <div className="pl-4 mt-1 space-y-2">
              {dataItems.map((item, idx) => (
                <JsonViewer key={idx} data={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Console = ({
  logs = [],
  onClean,
}: {
  logs?: ILog[];
  onClean?: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [autoScroll, setAutoScroll] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs;
    return logs.filter(
      (l) =>
        l.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(l.data).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm]);

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && endRef.current) {
      // Un pequeño timeout ayuda a que el ScrollArea recalcule la altura antes de hacer scroll
      setTimeout(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  }, [logs, autoScroll, filteredLogs.length]);

  return (
    <div className="h-full min-h-0 flex flex-col  bg-[#0c0c0c] border-t border-border overflow-hidden rounded-b-lg">
      {/* Toolbar */}
      <div className="flex justify-between items-center px-2 py-1.5 bg-muted/40 border-b border-border gap-2">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input
              className="h-7 text-xs pl-7 bg-black/20 border-border/50 focus-visible:ring-1 focus-visible:ring-offset-0"
              placeholder="Filter logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant={autoScroll ? "default" : "ghost"}
            size="icon"
            className={cn(
              "h-6 w-6",
              autoScroll && "bg-blue-600 hover:bg-blue-700"
            )}
            onClick={() => setAutoScroll(!autoScroll)}
            title="Toggle Auto-scroll"
          >
            <ArrowDownToLine className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-red-900/20 hover:text-red-400"
            onClick={onClean}
            title="Clear Console"
          >
            <Ban className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* 2. Reemplazamos el div con overflow nativo por ScrollArea */}
      <ScrollArea className="flex-1 bg-black/10 max-h-[94%]">
        <div className="p-2 flex flex-col min-h-full">
          {filteredLogs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground/40 italic text-xs gap-2 py-10">
              <span>Waiting for output...</span>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredLogs.map((log, index) => (
                <LogItem key={index} log={log} />
              ))}
              <div ref={endRef} className="h-px w-full" />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
