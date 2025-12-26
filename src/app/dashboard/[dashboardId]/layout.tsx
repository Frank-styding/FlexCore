"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode, useEffect, useId, useRef } from "react"; // <--- Importa useRef
import { DashbaordSidebar } from "./DashboardSidebar";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/providers/ModalProvider";
import { LoadingModal } from "@/components/custom/Modals/LoadingModal";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchPages } from "@/lib/redux/features/pageSlice";

export default function Layout({ children }: { children: ReactNode }) {
  const loadingId = useId();

  // Usamos un ref para saber si el modal ya está abierto y no spamear la función openModal
  const isModalOpenRef = useRef(false);

  const { openModal, closeModal } = useModals();

  const onSettings = () => {
    openModal("213123123_editor_modal");
  };

  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.pages.status);

  // 1. Fetch de datos
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPages());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (status === "loading") {
      if (!isModalOpenRef.current) {
        const message = "Sincronizando páginas...";
        const subMessage = "Obteniendo datos del servidor";

        openModal(loadingId, { message, subMessage });
        isModalOpenRef.current = true;
      }
    } else if (status === "succeeded" || status === "failed") {
      if (isModalOpenRef.current) {
        const timer = setTimeout(() => {
          closeModal(loadingId);
          isModalOpenRef.current = false;
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [status, openModal, closeModal, loadingId]);

  return (
    <SidebarProvider>
      <DashbaordSidebar />
      <main className="grid h-screen w-full min-w-0 grid-rows-[60px_1fr] overflow-hidden transition-[width] duration-300 ease-linear">
        <div className="grid w-full grid-cols-[40px_auto_40px] items-center  p-2">
          <SidebarTrigger classNameIcon="size-6" className="p-5" />
          <div />
          <div className="flex h-full w-full items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-full"
              onClick={onSettings}
            >
              <Settings className="size-6" />
            </Button>
          </div>
        </div>
        <div className="w-full overflow-auto bg-background">{children}</div>
      </main>
      {/*       <ComponentEditorModal id={editorId} onClose={onClose} /> */}
      <LoadingModal id={loadingId} />
    </SidebarProvider>
  );
}
