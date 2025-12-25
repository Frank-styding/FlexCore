import { Button } from "@/components/ui/button";
import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { cn } from "@/lib/utils";

export const DynamicButton = ({
  config,
  events,
  context,
}: Component & { context: Context }) => {
  const handleOnClick = (e: any) => {
    events.onClick?.(e, context);
  };
  return (
    <Button {...config} onClick={handleOnClick}>
      {config?.label}
    </Button>
  );
};
