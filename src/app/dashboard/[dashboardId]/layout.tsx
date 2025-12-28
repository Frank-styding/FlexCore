"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode, useEffect, useId, useRef } from "react"; // <--- Importa useRef
import { DashboardSidebar } from "./DashboardSidebar";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModals } from "@/components/providers/ModalProvider";
import { LoadingModal } from "@/components/custom/Modals/LoadingModal";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchPages } from "@/lib/redux/features/pageSlice";
import { useScriptConnectionActions } from "@/hooks/useScriptConnectionActions";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { fetchDashboards } from "@/lib/redux/features/dashboardSlice";

export default function Layout({ children }: { children: ReactNode }) {
  const loadingId = useId();

  // Usamos un ref para saber si el modal ya está abierto y no spamear la función openModal
  const isModalOpenRef = useRef(false);
  const hasConnectedRef = useRef(false);
  const { openModal, closeModal } = useModals();

  const onSettings = () => {
    openModal("213123123_editor_modal");
  };
  const { ConectionConfig } = useScriptConnectionActions(); // Hook de conexión
  const dispatch = useAppDispatch();
  const params = useParams();
  const dashboardId = params.dashboardId as string;
  const status = useAppSelector((state) => state.pages.status);
  const pagesStatus = useAppSelector((state) => state.pages.status);
  const dashboardsStatus = useAppSelector((state) => state.dashboards.status);
  // Selectores

  // Obtenemos el dashboard actual para sacar su config
  const currentDashboard = useAppSelector(
    (state) => state.dashboards.byId[dashboardId]
  );
  // 1. Fetch de datos
  useEffect(() => {
    // Cargar páginas si no existen
    if (pagesStatus === "idle") {
      dispatch(fetchPages());
    }

    // Cargar dashboards si no existen (ESTO ES LO QUE FALTABA)
    if (dashboardsStatus === "idle") {
      dispatch(fetchDashboards());
    }
  }, [pagesStatus, dashboardsStatus, dispatch]);
  useEffect(() => {
    const connectDB = async () => {
      // Verificamos si tenemos dashboard y configuración válida
      if (
        currentDashboard?.config &&
        currentDashboard.config.type &&
        !hasConnectedRef.current
      ) {
        try {
          hasConnectedRef.current = true; // Marcamos intento para evitar loops

          await ConectionConfig(currentDashboard.config as any);

          // SONNER: Notificación de éxito
          toast.success("Base de datos conectada", {
            description: `Proveedor: ${currentDashboard.config.type}`,
            duration: 3000,
          });
        } catch (error) {
          console.error(error);
          toast.error("Error de conexión", {
            description: "No se pudo conectar a la base de datos configurada.",
          });
          hasConnectedRef.current = false; // Permitir reintento si falla
        }
      }
    };

    if (dashboardsStatus === "succeeded") {
      connectDB();
    }
  }, [currentDashboard, dashboardsStatus, ConectionConfig]);
  useEffect(() => {
    const isLoading =
      pagesStatus === "loading" || dashboardsStatus === "loading";

    if (isLoading) {
      if (!isModalOpenRef.current) {
        const message = "Sincronizando...";
        const subMessage = "Obteniendo configuración y páginas";

        openModal(loadingId, { message, subMessage });
        isModalOpenRef.current = true;
      }
    } else {
      if (isModalOpenRef.current) {
        const timer = setTimeout(() => {
          closeModal(loadingId);
          isModalOpenRef.current = false;
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [pagesStatus, dashboardsStatus, openModal, closeModal, loadingId]);

  return (
    <SidebarProvider>
      <DashboardSidebar />
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
