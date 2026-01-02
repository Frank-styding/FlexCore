import { usePageStore } from "@/features/page/store/usePageStore";
import { useModalActions } from "@/hooks/useModal";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useId } from "react";
import { useUser } from "@/hooks/useUser";

export const useDashboardSidebar = () => {
  const router = useRouter();

  const params = useParams();
  const dashboardId = params.dashboardId as string;
  const pageId = params.pageId as string | undefined;
  const { fetchPages, status, pages, addPage, deletePage, renamePage } =
    usePageStore(pageId);
  const { openModal, closeModal, getModalData } = useModalActions();
  const addPageId = useId();
  const editPageId = useId();
  const confirmDeleteId = useId();
  const confirmConnectionId = useId();
  const user = useUser();

  // 1. Efectos
  useEffect(() => {
    if (!dashboardId) {
      router.replace("/dashboard");
    }
  }, [dashboardId, router]);

  useEffect(() => {
    if (status === "idle") {
      fetchPages(dashboardId);
    }
  }, [status]);

  const onAdd = useCallback(() => {
    openModal(addPageId);
  }, [openModal, addPageId]);

  const onConfirmAdd = useCallback(
    (data: Record<string, any>) => {
      addPage({
        name: data.name,
        icon: "LayoutDashboard",
        dashboardId,
        userId: user?.id,
      });
      closeModal(addPageId);
    },
    [addPage, dashboardId, user, closeModal, addPageId]
  );

  const onDelete = useCallback(
    (data: Record<string, any>) => {
      openModal(confirmDeleteId, data);
    },
    [openModal, confirmDeleteId]
  );

  const onConfirmDelete = useCallback(() => {
    const data = getModalData(confirmDeleteId);
    if (data?.id) {
      deletePage(data.id);
      router.replace(`/dashboard/${dashboardId}`);
    }
  }, [confirmDeleteId, getModalData, deletePage, router, dashboardId]);

  const onEdit = useCallback(
    (data: Record<string, any>) => {
      openModal(editPageId, data);
    },
    [openModal, editPageId]
  );

  const onConfirmEdit = useCallback(
    (newData: Record<string, string>) => {
      const data = getModalData(editPageId);
      if (data?.id) {
        renamePage(data.id, newData.name);
        closeModal(editPageId);
      }
    },
    [getModalData, editPageId, renamePage, closeModal]
  );

  const onSettings = useCallback(() => {
    openModal(confirmConnectionId);
  }, [openModal, confirmConnectionId]);

  return {
    status,
    pages,
    pageId,
    dashboardId,
    addPageId,
    editPageId,
    confirmDeleteId,
    confirmConnectionId,
    onAdd,
    onConfirmAdd,
    onDelete,
    onConfirmDelete,
    onEdit,
    onConfirmEdit,
    onSettings,
  };
};
