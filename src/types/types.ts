import { IconName } from "@/components/custom/DynamicIcon";

export interface IComponent {
  name: string;
  sqlScript: string;
  jsScript: string;
  path: string;
  subComponent?: Record<string, IComponent>;
}

export interface Page {
  icon: IconName;
  name: string;
  id: string;
  dashboardId: string;
  component: IComponent | null;
}

export interface Dashboard {
  id: string;
  name: string;
  pageIds: string[];
}
