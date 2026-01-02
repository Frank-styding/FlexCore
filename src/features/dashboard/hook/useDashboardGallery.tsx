import { useSignOut, useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useId } from "react";
import { useModalActions, useModalData } from "@/hooks/useModal";
import { useSearch } from "@/hooks/useSearch";
import { useDashboardActions } from "../store/useDashboard";

export const useDashboardGallery = () => {
  const router = useRouter();
  const editFormId = useId();
  const confirmId = useId();
  const addFormId = useId();
  const loadingModalId = useId();
  const { openModal, closeModal, getModalData } = useModalActions();

  const user = useUser();
  const signOut = useSignOut();

  const {
    dashboards,
    addDashboard,
    deleteDashboard,
    renameDashboard,
    isLoading,
    refresh,
  } = useDashboardActions();

  useEffect(() => {
    if (user) {
      refresh();
    }
  }, [user, refresh]);

  useEffect(() => {
    if (isLoading) {
      openModal(loadingModalId, {
        message: "Cargando galería...",
        subMessage: "Obteniendo tus dashboards desde la nube.",
      });
    } else {
      const timeout = setTimeout(() => {
        closeModal(loadingModalId);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, closeModal, openModal, loadingModalId]);

  const { query, setQuery, results } = useSearch(dashboards, (item, value) => {
    return item.name.toLowerCase().includes(value.toLowerCase());
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value);

  const onAdd = () => {
    openModal(addFormId);
  };

  const onConfirm = (data: Record<string, string>) => {
    closeModal(addFormId);
    setQuery("");
    if (!user) return;
    addDashboard(data["name"]);
  };

  const onClick = (id: string) => {
    router.replace(`/dashboard/${id}`);
  };

  const onDelete = (id: string) => {
    openModal(confirmId, { id });
  };

  const onConfirmDelete = () => {
    const data = getModalData(confirmId);
    deleteDashboard(data.id);
  };

  const onEdit = (id: string) => {
    openModal(editFormId, { id });
  };

  const onConfirmEdit = ({ name }: { name: string }) => {
    const data = getModalData(editFormId);
    renameDashboard(data.id, name);
    closeModal(editFormId);
  };

  const onSignOut = async () => {
    router.replace("/login");
    await signOut();
  };

  return {
    results,
    query,
    onChange,
    onAdd,
    onConfirm,
    onClick,
    onDelete,
    onConfirmDelete,
    onEdit,
    onConfirmEdit,
    onSignOut,
    addFormId,
    editFormId,
    confirmId,
    loadingModalId,
  };
};
