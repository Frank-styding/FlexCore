import { IconName } from "@/components/custom/DynamicIcon";
import {
  addPage,
  deletePage,
  renamePage,
} from "@/lib/redux/features/pageSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Page } from "@/types/types";

export const usePages = () => {
  const { dashboardsState, pagesState } = useAppSelector((state) => ({
    dashboardsState: state.dashboards,
    pagesState: state.pages,
  }));

  const dispatch = useAppDispatch();

  const dashboardId = dashboardsState.activeDashboardId as string;

  let pages: Page[] = [];

  if (dashboardId && dashboardsState.byId[dashboardId]) {
    pages = dashboardsState.byId[dashboardId].pageIds
      .map((id) => pagesState.byId[id])
      .filter((page) => page !== undefined); // Filtramos los que sean undefined
  }

  const funcAddPage = (name: string, icon: IconName) => {
    dispatch(addPage({ dashboardId, page: { name, icon } }));
  };

  const funcRenamePage = (id: string, name: string) => {
    dispatch(renamePage({ id, name }));
  };

  const funcDeletePage = (id: string) => {
    dispatch(deletePage({ id, dashboardId }));
  };

  return {
    pages,
    addPage: funcAddPage,
    renamePage: funcRenamePage,
    deletePage: funcDeletePage,
  };
};
