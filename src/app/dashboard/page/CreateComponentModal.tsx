import { ComponentEditor } from "@/components/custom/ComponentEditor/ComponentEditor";
import { Modal, ModalProps } from "@/components/custom/Modal";
import { Button } from "@/components/ui/button";

type CreateComponentModalProps = Omit<ModalProps, "title">;

export const CreateComponentModal = (props: CreateComponentModalProps) => {
  return (
    <Modal
      {...props}
      title="Create Component"
      className="min-w-[95%] min-h-[95%] max-h-[85%] grid grid-rows-[35px_1fr] gap-0"
    >
      <div className="w-full min-h-full  grid grid-rows-[1fr_40px] gap-3">
        <ComponentEditor />
        <div className="flex justify-end gap-5">
          <Button variant="outline"> Cancel </Button>
          <Button variant="default"> Create </Button>
        </div>
      </div>
    </Modal>
  );
};
