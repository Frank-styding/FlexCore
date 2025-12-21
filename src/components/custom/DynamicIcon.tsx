import { AlertCircle, icons } from "lucide-react";
import { LucideProps } from "lucide-react";

export type IconName = keyof typeof icons;
interface DynamicIconProps extends LucideProps {
  name: IconName;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  // 1. Buscamos el icono en el objeto 'icons' usando el string
  const LucideIcon = icons[name];

  // 2. Si el icono no existe (ej: error de tipeo en BD), devolvemos null o un icono por defecto
  if (!LucideIcon) {
    // Opcional: Retorna un icono de "alerta" o nada
    return <AlertCircle />;
  }

  return <LucideIcon {...props} />;
};
