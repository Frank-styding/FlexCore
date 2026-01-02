import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface GallerySearchBarProps {
  query: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
}

export const GallerySearchBar = ({
  query,
  onChange,
  onAdd,
}: GallerySearchBarProps) => {
  return (
    <div className="w-full h-20 flex gap-4">
      <Input
        onChange={onChange}
        placeholder="Buscar dashboard"
        value={query}
        aria-label="Buscar dashboard"
        className="flex-1"
      />
      <Button variant="default" onClick={onAdd}>
        Nuevo Dashboard
      </Button>
    </div>
  );
};
