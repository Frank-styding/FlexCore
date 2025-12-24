import { ComponentEditor } from "@/components/custom/ComponentEditor/ComponentEditor";
import { Modal, ModalProps } from "@/components/custom/Modal";
import { Button } from "@/components/ui/button";
import { usePageEditor } from "@/hooks/usePageEditor";

type CreateComponentModalProps = Omit<ModalProps, "title">;

// src/components/custom/Modal/CreateComponentModal.tsx
// ... imports

export const CreateComponentModal = (props: CreateComponentModalProps) => {
  const { sqlCode, jsCode, setJs, setSql } = usePageEditor();

  return (
    <Modal
      {...props}
      title="Create Component"
      className="min-w-[95%] min-h-[95%] max-h-[85%] grid grid-rows-[35px_1fr] gap-0"
    >
      <div className="w-full min-h-full grid grid-rows-[1fr_40px] gap-3">
        <ComponentEditor
          // Pasamos los valores que vienen del hook (que leen de Redux Pages)
          initialSql={sqlCode} // Ojo: si ComponentEditor usa useEffect interno, quizás necesites pasar 'sqlValue' controlado
          initialScript={jsCode} // Ojo: lo mismo aquí
          // Pasamos las funciones que actualizan Redux Pages
          onChangeJs={setJs} // Asumiendo que ComponentEditor usa onChangeJs
          onChangeSql={setSql} // Asumiendo que ComponentEditor usa onChangeSql
        />
        {/* ... botones ... */}
      </div>
    </Modal>
  );
};
