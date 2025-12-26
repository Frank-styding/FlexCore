"use client";

import { ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useModals } from "../providers/ModalProvider";

export interface ModalProps {
  id: string; // EL ID ES OBLIGATORIO Y ÚNICO
  triggerText?: string;
  title?: string;
  description?: string;
  className?: string;
  children?: ReactNode; // Aquí inyectaremos los inputs
  disableOutside?: boolean;
  disableEscape?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export function Modal({
  triggerText,
  title,
  children,
  id,
  description,
  className,
  disableEscape,
  disableOutside,
  onClose,
  onOpen,
}: ModalProps) {
  const { isModalOpen, closeModal, registerModal, unregisterModal } =
    useModals();

  // Obtenemos el estado actual desde el contexto
  const isOpen = isModalOpen(id);

  // EFECTO DE REGISTRO
  useEffect(() => {
    // 1. Al montar: Registrar ID
    registerModal(id);

    // 2. Al desmontar: Eliminar ID (y cerrar si estaba abierto)
    return () => {
      unregisterModal(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // S

  useEffect(() => {
    if (isOpen) {
      // Si isOpen pasa a true, ejecutamos onOpen
      onOpen?.();
    }
    // No necesitamos un else para onClose aquí, porque ese ya lo manejas
    // en el onOpenChange o cuando isOpen cambia a false externamente
  }, [isOpen, onOpen]);

  const openChange = (open: boolean) => {
    if (!open) {
      onClose?.();
      closeModal(id);
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogPortal>
        {triggerText && (
          <DialogTrigger asChild>
            <Button>{triggerText}</Button>
          </DialogTrigger>
        )}

        <DialogContent
          className={"sm:max-w-106.25 " + className}
          onEscapeKeyDown={(e) => {
            if (disableEscape) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (disableOutside) e.preventDefault();
          }}
        >
          <DialogHeader className="">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <DialogDescription className={!description ? "sr-only" : ""}>
            {description}
          </DialogDescription>

          <div className="mt-4">{children}</div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
