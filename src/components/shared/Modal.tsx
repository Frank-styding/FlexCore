"use client";

import { ReactNode, useEffect, useLayoutEffect } from "react";
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
import { useIsModalOpen, useModalActions } from "@/hooks/useModal";

export interface ModalProps {
  id: string;
  triggerText?: string;
  title?: string;
  description?: string;
  className?: string;
  children?: ReactNode;
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
  const { registerModal, unRegisterModal, closeModal } = useModalActions();
  const isOpen = useIsModalOpen(id);

  useLayoutEffect(() => {
    registerModal(id);
    return () => unRegisterModal(id);
  }, [id]);

  useEffect(() => {
    if (isOpen) onOpen?.();
  }, [isOpen]);

  const openChange = (open: boolean) => {
    if (open) return;
    onClose?.();
    closeModal(id);
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
