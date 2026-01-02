import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Switch } from "@radix-ui/react-switch";
import { Globe, Lock, ExternalLink, Settings } from "lucide-react";
import { DashboardHeaderProps } from "../types/dashboard.types";

export const DashboardHeader = ({
  currentPage,
  onPublicToggle,
  onOpenView,
  onSettings,
}: DashboardHeaderProps) => {
  return (
    <div className="grid w-full grid-cols-[auto_1fr_auto] items-center p-2">
      <SidebarTrigger classNameIcon="size-6" className="p-5" />
      <div />
      <div className="flex items-center gap-4 px-2">
        {currentPage && (
          <div className="flex items-center gap-2 border-r pr-4 mr-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="public-mode"
                checked={currentPage.isPublic || false}
                onCheckedChange={onPublicToggle}
                aria-label={currentPage.isPublic ? "Público" : "Privado"}
              />
              <Label
                htmlFor="public-mode"
                className="flex items-center gap-1 text-xs cursor-pointer select-none text-muted-foreground"
              >
                {currentPage.isPublic ? (
                  <Globe className="size-3" />
                ) : (
                  <Lock className="size-3" />
                )}
                {currentPage.isPublic ? "Público" : "Privado"}
              </Label>
            </div>
          </div>
        )}
        {currentPage && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenView}
              title="Abrir vista previa"
              aria-label="Abrir vista previa en nueva pestaña"
            >
              <ExternalLink className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onSettings}
              title="Configurar Scripts"
              aria-label="Configurar scripts de la página"
            >
              <Settings className="size-6" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
