"use client";

import { ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useModals } from "../providers/ModalProvider";

export interface ModalProps {
  id: string; // EL ID ES OBLIGATORIO Y ÚNICO
  triggerText?: string;
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode; // Aquí inyectaremos los inputs
}

export function Modal({
  triggerText,
  title,
  children,
  id,
  description,
  className,
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal(id)}>
      {triggerText && (
        <DialogTrigger asChild>
          <Button>{triggerText}</Button>
        </DialogTrigger>
      )}

      <DialogContent
        className={"sm:max-w-106.25 " + className}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {description && (
          <DialogDescription className="">{description}</DialogDescription>
        )}
        <div className="mt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
