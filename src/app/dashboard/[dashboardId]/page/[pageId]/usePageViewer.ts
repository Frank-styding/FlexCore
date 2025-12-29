/* eslint-disable react-hooks/refs */
import { useState, useEffect, useId, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchPageContent } from "@/lib/redux/features/pageSlice";
import { runScript } from "@/lib/runScript/runScript";
import { Component } from "@/lib/ComponentBuilders/Component";
import { useScriptActions } from "@/hooks/useScriptActions";
import { useScriptEditor } from "@/hooks/useScriptEditor";
import { useModals } from "@/components/providers/ModalProvider";
import { usePageEditor } from "@/hooks/usePageEditor";
import { useDashboards } from "@/hooks/useDashboards";
import { useDBConnection } from "@/hooks/useDBConnection";

export const usePageViewer = () => {
  // --- 1. HOOKS & ROUTING ---
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { openModal } = useModals();

  // Extraemos las acciones del editor
  const { setJsCode, setSqlCode, jsCode, sqlCode, isEditing, setIsEditing } =
    useScriptEditor();

  const { isConnected } = useDBConnection();

  const loadingId = useId();
  const pageId = params.pageId as string;
  const dashboardId = params.dashboardId as string;
  const { isSaving, savePage } = usePageEditor(pageId);

  // --- 2. ESTADO LOCAL ---
  const [componentStruct, setComponentStruct] = useState<Component | null>(
    null
  );
  const [isRunningScript, setIsRunningScript] = useState(false);

  // --- 3. REDUX SELECTORS ---
  const activePage = useAppSelector((state) =>
    pageId ? state.pages.byId[pageId] : null
  );

  const jsScript = activePage?.jsScript;
  const sqlScript = activePage?.sqlScript;
  // isContentReady nos dice si Redux ya tiene los datos completos (js y sql)
  const isContentReady = activePage?.isLoaded;

  // --- 4. GESTIÓN DE CONTEXTO (REF PATTERN) ---
  const scriptContext = useScriptActions();
  const scriptContextRef = useRef(scriptContext);

  // Mantenemos la ref actualizada sin disparar re-renders en el efecto de runScript
  scriptContextRef.current = scriptContext;

  // --- 5. REDIRECCIÓN DE SEGURIDAD ---
  useEffect(() => {
    if (!pageId && dashboardId) {
      router.replace(`/dashboard/${dashboardId}`);
    }
  }, [pageId, dashboardId, router]);

  // --- 6. DATA FETCHING (Optimizado con Ref) ---
  // Usamos una ref (lastFetchedPageId) en lugar de booleano para soportar cambios de página
  const lastFetchedPageId = useRef<string | null>(null);

  useEffect(() => {
    // Solo disparamos el fetch si:
    // 1. Tenemos ID.
    // 2. Redux dice que NO está listo (isLoaded = false).
    // 3. NO hemos intentado cargar este ID en este montaje especifico.
    if (pageId && !isContentReady && lastFetchedPageId.current !== pageId) {
      lastFetchedPageId.current = pageId; // Marcamos INMEDIATAMENTE para bloquear reintentos

      dispatch(fetchPageContent(pageId))
        .unwrap()
        .catch((err) => {
          console.error("Error fetching page content:", err);
          // Opcional: Si quieres permitir reintentos manuales en el futuro, podrías limpiar la ref aquí.
        });
    }
  }, [pageId, isContentReady, dispatch]);
  // --- 7. EFECTO: EJECUCIÓN DE SCRIPT ---
  useEffect(() => {
    let isMounted = true;

    // A. Validaciones iniciales
    if (!pageId || !isContentReady || !isConnected) return;

    // B. Si no hay script, limpiamos todo y aseguramos apagar el loading
    if (!jsScript || jsScript.trim() === "") {
      setComponentStruct(null);
      setIsRunningScript(false);
      return;
    }

    // C. Ejecución
    setIsRunningScript(true);

    // NOTA: Pasamos los scripts directamente de Redux, NO usamos setJsCode (eso causaba el loop)
    runScript(jsScript, sqlScript || "", scriptContextRef.current)
      .then(({ result }) => {
        if (isMounted) {
          setComponentStruct(result);
        }
      })
      .catch((err) => {
        console.error("Error ejecutando script de página:", err);
        if (isMounted) setComponentStruct(null);
      })
      .finally(() => {
        if (isMounted) setIsRunningScript(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pageId, isContentReady, jsScript, sqlScript, isConnected]);

  // --- 8. HANDLERS ---

  // Sincronizamos el Editor Global SOLO cuando el usuario decide editar manualmente
  const handleOnOpenEditor = useCallback(() => {
    if (jsScript) setJsCode(jsScript);
    if (sqlScript) setSqlCode(sqlScript || "");
    setIsEditing(true);
  }, [jsScript, sqlScript, setJsCode, setSqlCode, setIsEditing]);

  const handleConfigure = useCallback(() => {
    openModal("213123123_editor_modal");
  }, [openModal]);

  const handleOnCloseEditor = useCallback(() => {
    setIsEditing(false);
  }, [setIsEditing]);

  const onSave = useCallback(() => {
    savePage(jsCode, sqlCode);
  }, [jsCode, sqlCode, savePage]);

  // --- 9. ESTADO CALCULADO ---
  const isLoading = !isContentReady || isRunningScript;

  return {
    componentStruct,
    activePage,
    isLoading,
    isEditing,
    setIsEditing,
    loadingId,
    handleConfigure,
    handleOnCloseEditor,
    handleOnOpenEditor,
    onSave,
    isSaving,
  };
};
