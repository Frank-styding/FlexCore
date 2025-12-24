"use client";

import { useModals } from "@/components/providers/ModalProvider";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { CreateComponentModal } from "./CreateComponentModal";

export default function Page() {
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
          className="w-40 h-40 flex items-center gap-2 justify-center flex-col text-lg"
        >
          <Settings className="size-5" />
          Configure Page
        </Button>
      </div>

      <CreateComponentModal id="create-component" />
    </>
  );
}
