"use client";
import {
  DashboardGrid,
  GalleryHeader,
  GalleryModals,
  GallerySearchBar,
} from "@/features/dashboard";
import { useDashboardGallery } from "@/features/dashboard/hook/useDashboardGallery";

export default function DashboardGallery() {
  const {
    results,
    query,
    onChange,
    onClick,
    onAdd,
    onDelete,
    onConfirmDelete,
    onConfirm,
    onEdit,
    addFormId,
    editFormId,
    confirmId,
    loadingModalId,
    onConfirmEdit,
    onSignOut,
  } = useDashboardGallery();

  return (
    <div className="p-8 flex flex-col min-h-screen">
      <GalleryHeader onSignOut={onSignOut} />
      <div className="w-full flex-1">
        <GallerySearchBar query={query} onChange={onChange} onAdd={onAdd} />
        <DashboardGrid
          dashboards={results}
          onClick={onClick}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <GalleryModals
          addFormId={addFormId}
          editFormId={editFormId}
          confirmId={confirmId}
          loadingModalId={loadingModalId}
          onConfirm={onConfirm}
          onConfirmEdit={onConfirmEdit}
          onConfirmDelete={onConfirmDelete}
        />
      </div>
    </div>
  );
}
