// src/hooks/usePageEditor.ts
import { updatePageScript } from "@/lib/redux/features/pageSlice"; // Importa la acción nueva
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

export const usePageEditor = () => {
  // Obtenemos el ID y el diccionario de páginas
  const { activePage, byId } = useAppSelector((state) => state.pages);
  const dispatch = useAppDispatch();

  // Obtenemos la página actual.
  // Usamos ?. por si activePage es null al inicio
  const page = activePage ? byId[activePage] : null;

  return {
    // Valores con fallback por si no hay página seleccionada
    sqlCode: page?.sqlScript || "",
    jsCode: page?.jsScript || "",

    // ✅ CORRECCIÓN: Despachamos al slice de PAGES, no al de ScriptEditor
    setSql: (code: string) => {
      if (activePage) {
        dispatch(updatePageScript({ id: activePage, sql: code }));
      }
    },
    setJs: (code: string) => {
      if (activePage) {
        dispatch(updatePageScript({ id: activePage, js: code }));
      }
    },
  };
};
