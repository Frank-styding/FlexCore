import { ComponentEditor } from "@/components/custom/ComponentEditor/ComponentEditor";
import { Modal, ModalProps } from "@/components/custom/Modal";
import { useModals } from "@/components/providers/ModalProvider";
import { Button } from "@/components/ui/button";
import { usePageEditor } from "@/hooks/usePageEditor";
import { useState } from "react";

type CreateComponentModalProps = Omit<ModalProps, "title">;

// src/components/custom/Modal/CreateComponentModal.tsx
// ... imports

export const ComponentEditorModal = (props: CreateComponentModalProps) => {
  const { sqlCode, jsCode, setJs, setSql } = usePageEditor();
  const { closeModal } = useModals();

  const [sqlCodeTemp, setSqlTemp] = useState("");
  const [jsCodeTemp, setJsTemp] = useState("");

  const onSave = () => {
    /*    closeModal(props.id); */
    setJs(jsCodeTemp);
    setSql(sqlCodeTemp);
  };

  return (
    <Modal
      {...props}
      disableEscape
      disableOutside
      title="Create Component"
      className="min-w-[95%] min-h-[95%] max-h-[85%] grid grid-rows-[35px_1fr] gap-0"
    >
      <ComponentEditor
        // Pasamos los valores que vienen del hook (que leen de Redux Pages)
        initialSql={sqlCode} // Ojo: si ComponentEditor usa useEffect interno, quizás necesites pasar 'sqlValue' controlado
        initialScript={jsCode} // Ojo: lo mismo aquí
        // Pasamos las funciones que actualizan Redux Pages
        onChangeJs={setJsTemp} // Asumiendo que ComponentEditor usa onChangeJs
        onChangeSql={setSqlTemp} // Asumiendo que ComponentEditor usa onChangeSql
        onSave={onSave}
      />
    </Modal>
  );
};
