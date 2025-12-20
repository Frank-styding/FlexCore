/* eslint-disable @typescript-eslint/no-explicit-any */
import { useModals } from "@/components/providers/ModalProvider";
import { useSearch } from "@/hooks/useSearch";
import { addDashboard, deleteDashboard } from "@/lib/redux/features/dashboard";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { UseFormSetError } from "react-hook-form";

export const useDashboarGallery = () => {
  const { openModal, closeModal, getModalData } = useModals();
  const router = useRouter();

  const names = useAppSelector((state) => state.dashboard.names);
  const dispatch = useAppDispatch();

  const [data, value, setValue] = useSearch(names, (item, value) => {
    return item.toLowerCase().includes(value.toLowerCase());
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  const onAdd = () => {
    openModal("add-dashboard");
  };

  const onConfirm = (
    data: Record<string, string>,
    setError: UseFormSetError<any>
  ) => {
    if (names.includes(data["name"])) {
      setError("name", {
        type: "manual",
        message: "The dashboard already exist",
      });
      return;
    }
    closeModal("add-dashboard");
    setValue("");
    dispatch(addDashboard(data["name"]));
  };

  const onClick = (item: string) => {
    router.push(`/dashboard?id=${item}`);
  };

  const onDelete = (item: string) => {
    openModal("confirm", { item });
  };

  const onConfirmDelete = () => {
    const data = getModalData("confirm");
    dispatch(deleteDashboard(data.item));
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
  };
};
