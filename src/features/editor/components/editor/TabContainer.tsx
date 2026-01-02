import { ReactNode } from "react";

export const TabContainer = ({
  show,
  children,
}: {
  show?: boolean;
  children?: ReactNode;
}) => {
  // Si no se debe mostrar, no renderizamos nada (más limpio que el Fragment)
  if (!show) return null;

  return (
    <div className="flex-1 h-full min-w-0 rounded-lg overflow-hidden border border-border bg-background relative transition-all">
      {children}
    </div>
  );
};
