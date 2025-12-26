/* eslint-disable @typescript-eslint/no-explicit-any */
import { useModals } from "@/components/providers/ModalProvider";
import { useDashboards } from "@/hooks/useDashboards";
/* import { useRouterSync } from "@/hooks/useRouterSync"; */
import { useSearch } from "@/hooks/useSearch";
import { useRouter } from "next/navigation";

import { ChangeEvent, useId } from "react";

export const useDashboarGallery = () => {
  const editFormId = useId();
  const confirmId = useId();
  const addFormId = useId();
  const { openModal, closeModal, getModalData } = useModals();

  const router = useRouter();

  const {
    dashboards,
    addDashboard,
    deleteDashboard,
    renameDashboard,
    selectDashboard,
  } = useDashboards();

  /* const dashboards = useAppSelector((state) => state.dashboard.dashboards); */

  /*   const dispatch = useAppDispatch(); */

  const [data, value, setValue] = useSearch(dashboards, (item, value) => {
    return item.name.toLowerCase().includes(value.toLowerCase());
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  const onAdd = () => {
    openModal(addFormId);
  };

  const onConfirm = (data: Record<string, string>) => {
    closeModal(addFormId);
    setValue("");
    addDashboard(data["name"]);
    //dispatch(addDashboard({ name: data["name"] }));
  };

  const onClick = (id: string) => {
    selectDashboard(id);
    router.push("/dashboard");
  };

  const onDelete = (id: string) => {
    openModal(confirmId, { id });
  };

  const onConfirmDelete = () => {
    const data = getModalData(confirmId);
    deleteDashboard(data.id);
    /*     dispatch(deleteDashboard({ id: data.id })); */
  };

  const onEdit = (id: string) => {
    openModal(editFormId, { id });
  };

  const onConfirmEdit = ({ name }: { name: string }) => {
    const data = getModalData(editFormId);
    renameDashboard(data.id, name);
    /*     dispatch(editDashboard({ dashboardId: data.id, name })); */
    closeModal(editFormId);
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
    addFormId,
    editFormId,
    confirmId,
  };
};
