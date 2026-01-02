import { IconName } from "@/components/ui/dynamic-icon";

export interface Page {
  icon: IconName;
  name: string;
  id: string;
  dashboardId: string;
  sqlScript: string;
  jsScript: string;
  isPublic: boolean;
}
