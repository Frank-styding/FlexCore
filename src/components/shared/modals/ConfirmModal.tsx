import { useModalActions } from "@/hooks/useModal";
import { Modal, ModalProps } from "../Modal";
import { Button } from "@/components/ui/button";

type ConfirmModalProps = ModalProps & {
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmName?: string;
};

export const ConfirmModal = (props: ConfirmModalProps) => {
  const { closeModal } = useModalActions();
  const onCancel = () => {
    props.onCancel?.();
    closeModal(props.id);
  };
  const onConfirm = () => {
    props.onConfirm?.();
    closeModal(props.id);
  };

  return (
    <Modal {...props} className={"w-80 " + props.className}>
      <div className="w-full  flex gap-10 justify-center">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="default" onClick={onConfirm}>
          {props.confirmName ?? "Confirmar"}
        </Button>
      </div>
    </Modal>
  );
};
