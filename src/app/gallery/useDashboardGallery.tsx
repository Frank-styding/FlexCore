/* eslint-disable @typescript-eslint/no-explicit-any */
import { useModals } from "@/components/providers/ModalProvider";
import { useRouterSync } from "@/hooks/useRouterSync";
import { useSearch } from "@/hooks/useSearch";
import {
  addDashboard,
  deleteDashboard,
  editDashboard,
} from "@/lib/redux/features/dashboardSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";

export const useDashboarGallery = () => {
  const { openModal, closeModal, getModalData } = useModals();

  const { navigate } = useRouterSync();

  const dashboards = useAppSelector((state) => state.dashboard.dashboards);

  const dispatch = useAppDispatch();

  const [data, value, setValue] = useSearch(dashboards, (item, value) => {
    return item.name.toLowerCase().includes(value.toLowerCase());
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  const onAdd = () => {
    openModal("add-dashboard");
  };

  const onConfirm = (data: Record<string, string>) => {
    closeModal("add-dashboard");
    setValue("");
    dispatch(addDashboard({ name: data["name"] }));
  };

  const onClick = (id: string) => {
    navigate("/dashboard", { dashboardId: id });
  };

  const onDelete = (id: string) => {
    openModal("confirm", { id });
  };

  const onConfirmDelete = () => {
    const data = getModalData("confirm");
    dispatch(deleteDashboard({ id: data.id }));
  };

  const onEdit = (id: string) => {
    openModal("edit-dashboard", { id });
  };

  const onConfirmEdit = ({ name }: { name: string }) => {
    const data = getModalData("edit-dashboard");
    dispatch(editDashboard({ dashboardId: data.id, name }));
    closeModal("edit-dashboard");
  };

  return {
    data,
    value,
    onChange,
    onAdd,
    onConfirm,
    onClick,
    onDelete,
    onConfirmDelete,
    onEdit,
    onConfirmEdit,
  };
};
