/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useId, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useModalActions } from "@/hooks/useModal";
import { usePageStore } from "../store/usePageStore";
import { useEditor, useEngine } from "@/features/engine";
import { IEngine } from "@/features/engine/modules";
import { IComponent } from "@/features/engine/modules/types/component.type";

export const usePageViewer = () => {
  // --- 1. HOOKS & ROUTING ---
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

  /*   const { setJsCode, setSqlCode, jsCode, sqlCode, isEditing, setIsEditing } =
    useScriptEditor(); */
  /* 
  const { isConnected } = useDBConnection();

  const { isSaving } = usePageEditor(pageId);
 */
  const [componentStruct, setComponentStruct] = useState<IComponent | null>(
    null
  );

  const [isRunningScript, setIsRunningScript] = useState(false);

  useEffect(() => {
    if (!pageId && dashboardId) {
      router.replace(`/dashboard/${dashboardId}`);
    }
  }, [pageId, dashboardId, router]);

  useEffect(() => {
    if (pageId && !page?.isLoaded && isConnected) {
      fetchContent();
    }
  }, [pageId, isConnected]);

  const [engine, setEngine] = useState<IEngine | null>(null);

  useEffect(() => {
    setEngine(createEngine());
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!pageId || !page?.isLoaded || !isConnected) return;

    if (!page.jsScript || page.jsScript.trim() === "") {
      setComponentStruct(null);
      setIsRunningScript(false);
      return;
    }
    setIsRunningScript(true);

    if (!engine) {
      setIsRunningScript(false);
      return;
    }

    runScript(page.jsScript, page.sqlScript, engine)
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
  }, [page, isConnected]);

  const handleOnOpenEditor = useCallback(() => {
    if (page?.jsScript) setJsCode(page?.jsScript ?? "");
    if (page?.sqlScript) setSqlCode(page?.sqlScript ?? "");
    setIsEditing(true);
  }, [setJsCode, setSqlCode, setJsCode, setSqlCode, setIsEditing, page]);

  const handleConfigure = useCallback(() => {
    openModal("213123123_editor_modal");
  }, [openModal]);

  const handleOnCloseEditor = useCallback(() => {
    setIsEditing(false);
  }, [setIsEditing]);

  const onSave = useCallback(() => {
    saveCode(jsCode, sqlCode);
  }, [pageId, jsCode, sqlCode, saveCode]);

  const isLoading = !page || isRunningScript;

  return {
    engine,
    componentStruct,
    page,
    isLoading,
    isEditing: false,
    setIsEditing: (value?: boolean) => {},
    loadingId,
    handleConfigure,
    handleOnCloseEditor,
    handleOnOpenEditor,
    onSave,
    /*     isSaving, */
  };
};
