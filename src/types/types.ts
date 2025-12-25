import { IconName } from "@/components/custom/DynamicIcon";

export interface Page {
  icon: IconName;
  name: string;
  id: string;
  dashboardId: string;
  sqlScript: string;
  jsScript: string;
}

export interface Dashboard {
  id: string;
  name: string;
  pageIds: string[];
  config: Record<string, any>;
  configScript: string;
}
