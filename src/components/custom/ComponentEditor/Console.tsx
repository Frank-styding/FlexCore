import { Button } from "@/components/ui/button";
import { BrushCleaning } from "lucide-react";
import { v4 as uuid } from "uuid";

export interface ILog {
  message: string;
  data?: any;
}

export const renderLog = (log: ILog, index: number) => {
  const color = "text-yellow-400";
  let newData: any = log.data;
  if (!Array.isArray(newData)) {
    newData = [newData];
  }
  newData = newData.filter(Boolean);

  return (
    <div
      key={index}
      className="mb-2 border-b border-border/50 pb-2 last:border-0"
    >
      <div className={`flex items-center gap-2 font-bold text-xs ${color}`}>
        {log.message != "" && <span>{log.message}</span>}
      </div>
      {newData.map((item) => (
        <pre
          key={uuid()}
          className="mt-1 text-xs text-muted-foreground bg-muted/20 p-2 rounded overflow-x-auto max-h-40"
        >
          {JSON.stringify(item, null, 2)}
        </pre>
      ))}
    </div>
  );
};

export const Console = ({
  logs,
  onClean,
}: {
  logs?: ILog[];
  onClean?: () => void;
}) => {
  return (
    <div className="h-full border-t bg-black flex flex-col">
      <div className="flex justify-between items-center px-3 py-1 bg-muted/50 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={onClean}
        >
          <BrushCleaning className="w-3 h-3" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-3 font-mono text-sm">
        {logs?.length === 0 && (
          <span className="text-gray-600 italic text-xs">
            Run the pipeline to see results...
          </span>
        )}
        {logs?.map(renderLog)}
      </div>
    </div>
  );
};
