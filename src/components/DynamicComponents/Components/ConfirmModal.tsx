import { ConfirmModal } from "@/components/custom/Modals/ConfirmModal";
import { Component, Context } from "@/lib/ComponentBuilders/Component";

export const DynamicConfirmModal = ({
  config,
  events,
  id,
  context,
}: Component & { context: Context }) => {
  const handleOnConfirm = () => {
    events.onConfirm?.(undefined, context);
  };

  const handleOnCancel = () => {
    events.onCancel?.(undefined, context);
  };

  return (
    <ConfirmModal
      {...config}
      title={config?.title ?? ""}
      id={id}
      onConfirm={handleOnConfirm}
      onCancel={handleOnCancel}
    />
  );
};
