import { ComponentEditor } from "@/components/custom/ComponentEditor/ComponentEditor";
import { Modal, ModalProps } from "@/components/custom/Modal";
import { useScriptEditor } from "@/hooks/useScriptEditor";

type CreateComponentModalProps = Omit<ModalProps, "title"> & {
  isSaving?: boolean;
  onSave?: () => void;
};

export const ComponentEditorModal = (props: CreateComponentModalProps) => {
  /*   const { isSaving, savePage } = usePageEditor(); */
  const { clearConsole } = useScriptEditor();

  /*   const onSave = () => {
    savePage(jsCode, sqlCode);
  };
 */
  const onClose = () => {
    props.onClose?.();

    clearConsole();
  };

  return (
    <Modal
      {...props}
      onClose={onClose}
      disableEscape
      disableOutside
      title="Create Component"
      className="min-w-[95%] min-h-[95%] max-h-[85%] grid grid-rows-[35px_1fr] gap-0"
    >
      <ComponentEditor
        /*         initialSql={sqlCode}
        initialScript={jsCode} */
        /*         onChangeJs={setJsTemp} // Asumiendo que ComponentEditor usa onChangeJs
        onChangeSql={setSqlTemp} // Asumiendo que ComponentEditor usa onChangeSql */
        onSave={props.onSave}
        isSaving={props.isSaving}
      />
    </Modal>
  );
};
