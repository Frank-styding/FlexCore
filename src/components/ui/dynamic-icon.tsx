import { AlertCircle, icons } from "lucide-react";
import { LucideProps } from "lucide-react";

export type IconName = keyof typeof icons;
interface DynamicIconProps extends LucideProps {
  name: IconName;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const LucideIcon = icons[name];
  if (!LucideIcon) {
    return <AlertCircle />;
  }
  return <LucideIcon {...props} />;
};
