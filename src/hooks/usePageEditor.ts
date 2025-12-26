// src/hooks/usePageEditor.ts
import { updatePageRemote } from "@/lib/redux/features/pageSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

export const usePageEditor = (pageId: string) => {
  // 1. Obtenemos el status para saber si está cargando
  const { byId, status } = useAppSelector((state) => state.pages);
  const dispatch = useAppDispatch();

  const page = pageId ? byId[pageId] : null;

  return {
    sqlCode: page?.sqlScript || "",
    jsCode: page?.jsScript || "",

    // 2. Exponemos la bandera de carga
    isSaving: status === "loading",

    // Setters individuales (por si los necesitas)
    setSql: (code: string) => {
      if (pageId) {
        dispatch(
          updatePageRemote({ id: pageId, updates: { sqlScript: code } })
        );
      }
    },
    setJs: (code: string) => {
      if (pageId) {
        dispatch(updatePageRemote({ id: pageId, updates: { jsScript: code } }));
      }
    },

    // 3. NUEVA FUNCIÓN: Guardar todo junto (Mucho más eficiente)
    savePage: (js: string, sql: string) => {
      if (pageId) {
        dispatch(
          updatePageRemote({
            id: pageId,
            updates: {
              jsScript: js,
              sqlScript: sql,
            },
          })
        );
      }
    },
  };
};
