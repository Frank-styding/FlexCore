/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useId, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useModalActions } from "@/hooks/useModal";
import { usePageStore } from "../store/usePageStore";
import { useEditor, useEngine } from "@/features/engine";
import { IEngine } from "@/features/engine/modules";
import { IComponent } from "@/features/engine/modules/types/component.type";

export const usePageViewer = () => {
  const loadingId = useId();
  const router = useRouter();
  const params = useParams();

  const pageId = params.pageId as string;
  const dashboardId = params.dashboardId as string;

  const { openModal } = useModalActions();
  const { fetchContent, page, saveCode } = usePageStore(pageId);
  const { isConnected, createEngine, runScript } = useEngine();
  const { sqlCode, jsCode, setJsCode, setSqlCode, setIsEditing, isEditing } =
    useEditor();

  const [componentStruct, setComponentStruct] = useState<IComponent | null>(
    null
  );

  // 1. ESTADO DE SEGUIMIENTO DE TRANSICIÓN
  const [lastPageId, setLastPageId] = useState<string>(pageId);

  // 2. ESTADO DE EJECUCIÓN
  const [isRunningScript, setIsRunningScript] = useState(true);

  const [engine, setEngine] = useState<IEngine | null>(null);

  // Inicializar Engine
  useEffect(() => {
    setEngine(createEngine());
  }, []);

  // Redirección
  useEffect(() => {
    if (!pageId && dashboardId) {
      router.replace(`/dashboard/${dashboardId}`);
    }
  }, [pageId, dashboardId, router]);

  // --- DETECCIÓN DE CAMBIO DE PÁGINA ---
  useEffect(() => {
    if (pageId !== lastPageId) {
      setComponentStruct(null);
      setIsRunningScript(true);
      setLastPageId(pageId);
    }
  }, [pageId, lastPageId]);

  // Fetch de contenido
  useEffect(() => {
    if (pageId && !page?.isLoaded && isConnected) {
      fetchContent();
    }
  }, [pageId, isConnected, page?.isLoaded, fetchContent]);

  // Ejecución del Script
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    if (pageId !== lastPageId) return;

    if (!pageId || !page?.isLoaded || !isConnected || !engine) return;
    if (page.id !== pageId) return;

    // Caso: Página sin script
    if (!page.jsScript || page.jsScript.trim() === "") {
      if (isMounted) {
        setComponentStruct(null);
        // DELAY AGREGADO: Forzamos 200ms antes de quitar el loader
        timeoutId = setTimeout(() => {
          if (isMounted) setIsRunningScript(false);
        }, 1500);
      }
      return () => clearTimeout(timeoutId);
    }

    setIsRunningScript(true);

    runScript(page.jsScript, page.sqlScript, engine)
      .then(({ result }) => {
        if (isMounted) {
          setComponentStruct(result);
        }
      })
      .catch((err) => {
        console.error("Error ejecutando script:", err);
        if (isMounted) setComponentStruct(null);
      })
      .finally(() => {
        // DELAY AGREGADO: Forzamos 200ms al terminar el script
        timeoutId = setTimeout(() => {
          if (isMounted) setIsRunningScript(false);
        }, 200);
      });

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [page, isConnected, engine, pageId, lastPageId]);

  // --- Handlers ---
  const handleOnOpenEditor = useCallback(() => {
    if (page?.jsScript) setJsCode(page?.jsScript ?? "");
    if (page?.sqlScript) setSqlCode(page?.sqlScript ?? "");
    setIsEditing(true);
  }, [setJsCode, setSqlCode, setIsEditing, page]);

  const handleConfigure = useCallback(() => {
    openModal("213123123_editor_modal");
  }, [openModal]);

  const handleOnCloseEditor = useCallback(() => {
    setIsEditing(false);
  }, [setIsEditing]);

  const onSave = useCallback(() => {
    saveCode(jsCode, sqlCode);
  }, [jsCode, sqlCode, saveCode]);

  // --- LÓGICA DE CARGA ---
  const isLoading =
    pageId !== lastPageId || // Transición instantánea
    !page ||
    !page.isLoaded ||
    page.id !== pageId ||
    isRunningScript; // Se mantiene true durante los 200ms extra

  return {
    engine,
    componentStruct,
    page,
    isLoading,
    isEditing,
    setIsEditing,
    loadingId,
    handleConfigure,
    handleOnCloseEditor,
    handleOnOpenEditor,
    onSave,
  };
};
