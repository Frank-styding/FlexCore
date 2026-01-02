import { useModalActions } from "@/hooks/useModal";
import { DynamicForm, DynamicFormProps } from "../DynamicForm";
import { Modal, ModalProps } from "../Modal";

type FormModalProps = ModalProps &
  Omit<DynamicFormProps, "className"> & { classNameForm?: string };

export const FormModal = (props: FormModalProps) => {
  const { closeModal } = useModalActions();
  const handleSummit = (data, error) => {
    props.onSubmit?.(data, error);
    closeModal(props.id);
  };
  return (
    <Modal {...props}>
      <DynamicForm
        {...props}
        onSubmit={handleSummit}
        className={props.classNameForm}
      />
    </Modal>
  );
};
