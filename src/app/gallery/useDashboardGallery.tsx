/* eslint-disable @typescript-eslint/no-explicit-any */
import { useModals } from "@/components/providers/ModalProvider";
import { useDashboards } from "@/hooks/useDashboards";
import { useSearch } from "@/hooks/useSearch";
import { useUser } from "@/hooks/useUser";
import { fetchDashboards } from "@/lib/redux/features/dashboardSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";

import { ChangeEvent, useEffect, useId } from "react";

export const useDashboarGallery = () => {
  const router = useRouter();
  const editFormId = useId();
  const confirmId = useId();
  const addFormId = useId();
  const loadingModalId = useId();
  const { openModal, closeModal, getModalData } = useModals();

  // 1. Obtenemos signOut del hook useUser
  const { user, signOut } = useUser();

  const {
    dashboards,
    addDashboard,
    deleteDashboard,
    renameDashboard,
    isLoading,
  } = useDashboards();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch(fetchDashboards());
    }
  }, [user, dispatch]);

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
  }, [isLoading]);

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

  // 2. Creamos el manejador para cerrar sesión
  const onSignOut = async () => {
    router.replace("/login");
    await signOut();
    // El middleware se encargará de redirigir al login
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
