import { DashboardCardData } from "../types/dashboard.types";
import { DashboardCard } from "./DashboardCard";

interface DashboardGridProps {
  dashboards: DashboardCardData[];
  onClick: (dashboardId: string) => void;
  onEdit: (dashboardId: string) => void;
  onDelete: (dashboardId: string) => void;
}

export const DashboardGrid = ({
  dashboards,
  onClick,
  onEdit,
  onDelete,
}: DashboardGridProps) => {
  if (dashboards.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground text-lg">
          No se encontraron dashboards.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {dashboards.map((dashboard) => (
        <DashboardCard
          key={dashboard.id}
          name={dashboard.name}
          onClick={() => onClick(dashboard.id)}
          onEdit={() => onEdit(dashboard.id)}
          onDelete={() => onDelete(dashboard.id)}
        />
      ))}
    </div>
  );
};
