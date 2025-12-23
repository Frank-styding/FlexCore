import { ReactNode } from "react";

export const TabContainer = ({
  show,
  children,
}: {
  show?: boolean;
  children?: ReactNode;
}) => {
  return <>{show && children}</>;
};
