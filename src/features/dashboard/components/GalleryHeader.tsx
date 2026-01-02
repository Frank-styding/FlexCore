import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface GalleryHeaderProps {
  onSignOut: () => void;
}

export const GalleryHeader = ({ onSignOut }: GalleryHeaderProps) => {
  return (
    <div className="mb-10 pt-2 flex justify-between items-center">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Button
        variant="ghost"
        onClick={onSignOut}
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </Button>
    </div>
  );
};
