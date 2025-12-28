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

export const usePageViewer = () => {
  // --- 1. HOOKS & ROUTING ---
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { openModal } = useModals();
  const { setJsCode, setSqlCode, sqlCode, jsCode, isEditing, setIsEditing } =
    useScriptEditor();
  // IDs
  const loadingId = useId();
  const pageId = params.pageId as string;
  const dashboardId = params.dashboardId as string;
  const { isSaving, savePage } = usePageEditor(pageId);

  // --- 2. ESTADO LOCAL ---
  const [componentStruct, setComponentStruct] = useState<Component | null>(
    null
  );
  /*   const [isEditing, setIsEditing] = useState(false); */
  const [isRunningScript, setIsRunningScript] = useState(false);
  const [isFetchingContent, setIsFetchingContent] = useState(false);

  // --- 3. REDUX SELECTORS ---
  const activePage = useAppSelector((state) =>
    pageId ? state.pages.byId[pageId] : null
  );

  const jsScript = activePage?.jsScript;
  const sqlScript = activePage?.sqlScript;
  const isContentReady = activePage?.isLoaded;

  // --- 4. GESTIÓN DE CONTEXTO (REF PATTERN) ---
  const scriptContext = useScriptActions();
  const scriptContextRef = useRef(scriptContext);

  useEffect(() => {
    scriptContextRef.current = scriptContext;
  }, [scriptContext]);

  // --- 5. EFECTO: REDIRECCIÓN DE SEGURIDAD ---
  useEffect(() => {
    if (!pageId) {
      router.replace(`/dashboard/${dashboardId}`);
    }
  }, [pageId, dashboardId, router]);

  // --- 6. EFECTO: DATA FETCHING (LAZY LOAD) ---
  useEffect(() => {
    if (pageId && !isContentReady && !isFetchingContent) {
      setIsFetchingContent(true);
      dispatch(fetchPageContent(pageId))
        .unwrap()
        .catch((err) => console.error("Error fetching page content:", err))
        .finally(() => setIsFetchingContent(false));
    }
  }, [pageId, isContentReady, isFetchingContent, dispatch]);

  // --- 7. EFECTO: EJECUCIÓN DE SCRIPT (SIN CACHÉ) ---
  useEffect(() => {
    let isMounted = true;

    // A. Validaciones de salida temprana
    if (!pageId || !isContentReady) {
      setComponentStruct(null);
      return;
    }

    if (!jsScript || jsScript.trim() === "") {
      setComponentStruct(null);
      setJsCode("");
      setSqlCode("");
      return;
    }

    // B. Sincronizar Editor
    setJsCode(jsScript);
    setSqlCode(sqlScript ?? "");

    // C. EJECUCIÓN DIRECTA
    setIsRunningScript(true);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId, isContentReady, jsScript, sqlScript]);

  // --- 8. ESTADO CALCULADO ---
  const isLoading = isFetchingContent || isRunningScript;

  // --- 9. HANDLERS ---
  const handleConfigure = useCallback(() => {
    openModal("213123123_editor_modal");
  }, [openModal]);

  const handleOnCloseEditor = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleOnOpenEditor = useCallback(() => {
    setIsEditing(true);
  }, []);
  const onSave = useCallback(() => {
    savePage(jsCode, sqlCode);
  }, [jsCode, sqlCode]);

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
