import { Component } from "@/lib/ComponentBuilders/Component";

export const DynamicComponent = ({ data }: { data?: Component }) => {
  if (!data) return null;
  return <div>{data.type}</div>;
};
