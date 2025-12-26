"use client";
import { Modal, ModalProps } from "@/components/custom/Modal";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModals } from "@/components/providers/ModalProvider";

// Definimos la estructura de datos que este modal espera recibir
interface LoadingModalData {
  message?: string;
  subMessage?: string;
}

// Ya no recibe message/subMessage por props, sino por el Contexto
type LoadingModalProps = ModalProps & {
  // Puedes mantener className o id aquí si los necesitas
};

export const LoadingModal = ({ className, ...props }: LoadingModalProps) => {
  const { getModalData } = useModals();

  // Recuperamos la data específica para este ID de modal
  // Si no hay data, usamos un objeto vacío por defecto
  const data = getModalData<LoadingModalData>(props.id) || {};

  // Valores por defecto si no se manda nada en la data
  const message = data.message || "Cargando...";
  const subMessage = data.subMessage;

  return (
    <Modal
      {...props}
      disableEscape
      disableOutside
      className={cn(
        "min-w-[300px] w-auto h-auto p-8 flex flex-col items-center justify-center outline-none",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Spinner */}
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>

        {/* Textos Dinámicos desde el Provider */}
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
