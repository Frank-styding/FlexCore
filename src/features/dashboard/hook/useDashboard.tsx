import { useEffect, useId, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

// Stores y Hooks
import { useDashboardActions } from "@/features/dashboard/store/useDashboard";
import { usePageStore } from "@/features/page/store/usePageStore"; // Asegúrate que la ruta sea correcta

// Tipos
import { useModalActions } from "@/hooks/useModal";
import { useEngine } from "@/features/engine";

export const useDashboard = () => {
  const params = useParams();
  const dashboardId = params?.dashboardId as string;
  const pageId = params?.pageId as string | undefined;

  const {
    dashboard: currentDashboard,
    status: dashboardStatus,
    refresh: fetchDashboards,
  } = useDashboardActions(dashboardId);

  const {
    status: pagesStatus,
    page: currentPage,
    updateSettings,
  } = usePageStore(pageId);

  // --- UTILS & REFS ---
  const { openModal, closeModal } = useModalActions();
  const { connect } = useEngine();
  /*   const { ConectionConfig } = useScriptConnectionActions(); */

  const loadingId = useId();
  const isModalOpenRef = useRef(false);
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    if (dashboardStatus === "idle") {
      fetchDashboards();
    }
  }, [dashboardStatus, fetchDashboards]);

  useEffect(() => {
    const connectDatabase = async () => {
      if (
        currentDashboard?.config &&
        currentDashboard.config.type &&
        !hasConnectedRef.current
      ) {
        try {
          hasConnectedRef.current = true;
          await connect(currentDashboard.config as any);

          toast.success("Base de datos conectada", {
            description: `Proveedor: ${currentDashboard.config.type}`,
            duration: 3000,
          });
        } catch (error) {
          console.error("Connection error:", error);
          toast.error("Error de conexión", {
            description: "No se pudo conectar a la base de datos configurada.",
          });
          hasConnectedRef.current = false;
        }
      }
    };

    if (dashboardStatus === "succeeded") {
      connectDatabase();
    }
  }, [currentDashboard, dashboardStatus, connect]);

  useEffect(() => {
    const isLoading = dashboardStatus === "loading";

    if (isLoading && !isModalOpenRef.current) {
      openModal(loadingId, {
        message: "Sincronizando...",
        subMessage: "Obteniendo configuración y páginas",
      });
      isModalOpenRef.current = true;
    } else if (!isLoading && isModalOpenRef.current) {
      const timer = setTimeout(() => {
        closeModal(loadingId);
        isModalOpenRef.current = false;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pagesStatus, dashboardStatus, openModal, closeModal, loadingId]);

  const handlePublicToggle = useCallback(
    async (checked: boolean) => {
      if (!currentPage || !updateSettings) return;

      try {
        await updateSettings({
          isPublic: checked,
        });

        toast.success(`Página ahora es ${checked ? "Pública" : "Privada"}`, {
          description: checked
            ? "Cualquiera con el enlace podrá verla."
            : "Solo tú puedes ver esta página.",
        });
      } catch (error) {
        toast.error("Error al actualizar privacidad");
        console.error("Toggle error:", error);
      }
    },
    [currentPage, updateSettings]
  );

  const handleOpenView = useCallback(() => {
    if (!currentPage) return;
    window.open(`/view/${currentPage.id}`, "_blank");
  }, [currentPage]);

  const handleOpenSettings = useCallback(() => {
    openModal("213123123_editor_modal");
  }, [openModal]);

  return {
    loadingId,
    currentPage,
    currentDashboard,
    isLoading: dashboardStatus === "loading",
    handlePublicToggle,
    handleOpenView,
    handleOpenSettings,
  };
};
