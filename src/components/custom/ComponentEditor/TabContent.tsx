import { ReactNode } from "react";

export const TabContent = ({
  children,
  id,
  currentId,
}: {
  children?: ReactNode;
  id?: string;
  currentId?: string;
}) => {
  if (id != undefined && currentId != id) {
    return <></>;
  }

  return <div className="flex-1 rounded-lg overflow-hidden">{children}</div>;
};
