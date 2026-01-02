import { LoadingModal } from "@/components/shared/modals/LoadingModal";

interface LoadingIndicatorProps {
  loadingId: string;
}

export const LoadingIndicator = ({ loadingId }: LoadingIndicatorProps) => {
  return <LoadingModal id={loadingId} title="Cargando Dashboard" />;
};
