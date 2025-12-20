import { useModals } from "@/components/providers/ModalProvider";
import { Modal, ModalProps } from "../Modal";
import { Button } from "@/components/ui/button";

type confirmModalProps = ModalProps & {
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const ConfirmModal = (props: confirmModalProps) => {
  const { closeModal } = useModals();
  const onCancel = () => {
    closeModal(props.id);
    props.onCancel?.();
  };
  const onConfirm = () => {
    closeModal(props.id);
    props.onConfirm?.();
  };

  return (
    <Modal {...props} className={"w-80 " + props.className}>
      <div className="w-full  flex gap-10 justify-center">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="default" onClick={onConfirm}>
          Confirmar
        </Button>
      </div>
    </Modal>
  );
};
