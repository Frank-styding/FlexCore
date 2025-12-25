import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { ReactNode } from "react";

export const DynamicLayout = ({
  config,
  children,
}: Component & { context: Context; children: ReactNode }) => {
  return <div {...config}>{children}</div>;
};
