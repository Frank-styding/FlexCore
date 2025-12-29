import { ConfirmModal } from "@/components/custom/Modals/ConfirmModal";
import { useScriptError } from "@/hooks/useScriptError";
import { Component, Context } from "@/lib/ComponentBuilders/Component";

export const DynamicConfirmModal = ({
  config,
  events,
  id,
  context,
}: Component & { context: Context }) => {
  const execute = useScriptError();
  const handleOnConfirm = () => {
    execute(events.onConfirm, undefined, context);
  };

  const handleOnCancel = () => {
    execute(events.onCancel, undefined, context);
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
