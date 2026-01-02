import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Asumiendo que usas la utilidad estándar de shadcn/ui

interface SearchToolbarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  actionLabel?: string;
  onAction?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const SearchToolbar = ({
  value,
  onChange,
  placeholder = "Buscar...",
  actionLabel,
  onAction,
  isLoading = false,
  className,
}: SearchToolbarProps) => {
  return (
    <div className={cn("w-full flex gap-4 items-center", className)}>
      <Input
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        aria-label={placeholder}
        className="flex-1"
        disabled={isLoading}
      />
      {actionLabel && (
        <Button variant="default" onClick={onAction} disabled={isLoading}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
