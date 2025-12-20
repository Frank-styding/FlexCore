import { DynamicForm, DynamicFormProps } from "../DynamicForm";
import { Modal, ModalProps } from "../Modal";

type FormModalProps = ModalProps &
  Omit<DynamicFormProps, "className"> & { classNameForm?: string };

export const FormModal = (props: FormModalProps) => {
  return (
    <Modal {...props}>
      <DynamicForm
        {...props}
        className={props.classNameForm}
        //className="md:grid-cols-2 md:2xl:grid-cols-3 md:3xl:grid-cols-4"
        /*         schema={carSchema}
        fields={carFields}
        confirmName="Dashboard"
        onSubmit={onConfirm} */
      />
    </Modal>
  );
};
