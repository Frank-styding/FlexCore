"use client";

import { Modal } from "@/components/custom/Modal";
import { useModals } from "@/components/providers/ModalProvider";
import { Button } from "@/components/ui/button";
import { useRouterSync } from "@/hooks/useRouterSync";
import { Plus } from "lucide-react";
import { CreateComponentModal } from "./CreateComponentModal";

export default function Page() {
  const { data } = useRouterSync();
  const { openModal } = useModals();
  const onClick = () => {
    openModal("create-component");
  };

  return (
    <>
      <div className="w-full min-h-full flex justify-center items-center">
        <Button
          onClick={onClick}
          variant="outline"
          className="w-40 h-40 flex items-center gap-2 justify-center flex-col"
        >
          <Plus />
          Add Component
        </Button>
      </div>

      <CreateComponentModal id="create-component" />
    </>
  );
}
