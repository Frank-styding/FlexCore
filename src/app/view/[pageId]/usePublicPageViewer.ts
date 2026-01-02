/* eslint-disable react-hooks/set-state-in-effect */
// hooks/usePublicPageViewer.ts
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { IComponent } from "@/features/engine/modules/types/component.type";
import { useEngine } from "@/features/engine";
import { IEngine } from "@/features/engine/modules";
import { usePageStore } from "@/features/page/store/usePageStore";

export const usePublicPageViewer = () => {
  const params = useParams();
  const pageId = params.pageId as string;
  const [componentStruct, setComponentStruct] = useState<IComponent | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isAccessDenied, setIsAccessDenied] = useState(false);
  const { createEngine, runScript, connect } = useEngine();
  const [engine, setEngine] = useState<IEngine | null>(null);
  const { fetchPublicPage } = usePageStore(pageId);

  useEffect(() => {
    setEngine(createEngine());
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadPublicPage = async () => {
      setIsAccessDenied(false);
      setComponentStruct(null);

      if (!pageId) return;

      try {
        setIsLoading(true);

        const data = await fetchPublicPage(pageId);

        /*         if (actionResult.meta.requestStatus === "rejected") {
          throw new Error("Error técnico al obtener la página");
        } */

        if (!data) {
          if (isMounted) setIsAccessDenied(true);
          return;
        }

        const { js_script, sql_script, dashboard_config } = data;

        // 2. Conectar a la Base de Datos del Cliente
        if (dashboard_config && dashboard_config.type) {
          // Pasamos false para no intentar guardar en Redux del Dashboard inexistente
          await connect(dashboard_config, false);
        }

        // 3. Ejecutar el Script
        if (js_script && engine) {
          const { result } = await runScript(
            js_script,
            sql_script || "",
            engine
          );

          if (isMounted) {
            setComponentStruct(result);
          }
        }
      } catch (error) {
        // Solo logueamos errores reales de ejecución, no bloqueos de acceso
        console.error("Error ejecutando página pública:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadPublicPage();

    return () => {
      isMounted = false;
    };
    // IMPORTANTE: Agregamos las dependencias correctas para que recargue si cambia el ID
  }, [engine]);

  return {
    componentStruct,
    isLoading,
    isAccessDenied,
    engine,
  };
};
