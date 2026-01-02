"use client";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal, ModalProps } from "../Modal";
import { useModalActions } from "@/hooks/useModal";

export const LoadingModal = ({ className, ...props }: ModalProps) => {
  const { getModalData } = useModalActions();
  const data = getModalData(props.id) || {};
  const message = data.message || "Cargando...";
  const subMessage = data.subMessage;
  return (
    <Modal
      {...props}
      disableEscape
      disableOutside
      className={cn(
        "min-w-75 w-auto h-auto p-8 flex flex-col items-center justify-center outline-none",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-foreground">{message}</h3>
          {subMessage && (
            <p className="text-sm text-muted-foreground animate-pulse">
              {subMessage}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};
