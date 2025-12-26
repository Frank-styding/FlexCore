import { IconName } from "@/components/custom/DynamicIcon";
import {
  addPageRemote,
  deletePageRemote,
  updatePageRemote,
} from "@/lib/redux/features/pageSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Page } from "@/types/types";
import { useUser } from "@/hooks/useUser"; // <--- 1. Importamos el hook de usuario
export const usePages = (dashbaordId?: string) => {
  // 2. Obtenemos el usuario autenticado
  const { user } = useUser();

  const pagesMap = useAppSelector((state) => state.pages.byId);

  const dispatch = useAppDispatch();

  /*   const activeDashboardId = data ? data["dashboardId"] : null;
   */
  let pages: Page[] = [];
  if (dashbaordId) {
    pages = Object.values(pagesMap).filter(
      (page) => page.dashboardId === dashbaordId
    );
  }

  return {
    pages,
    dashbaordId,
    addPage: (name: string, icon: IconName) => {
      // 3. Verificamos que tengamos tanto el Dashboard activo como el Usuario
      if (dashbaordId && user) {
        dispatch(
          addPageRemote({
            dashboardId: dashbaordId,
            name,
            icon,
            userId: user.id, // <--- 4. Pasamos el ID del usuario aquí
          })
        );
      } else {
        console.warn(
          "No se puede crear página: Falta usuario o dashboard activo"
        );
      }
    },

    renamePage: (id: string, name: string) => {
      dispatch(updatePageRemote({ id, updates: { name } }));
    },

    deletePage: (id: string) => {
      dispatch(deletePageRemote(id));
    },
  };
};
