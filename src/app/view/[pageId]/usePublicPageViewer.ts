// hooks/usePublicPageViewer.ts
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { Component } from "@/features/engine/lib/Builders/Component";
/* import { useAppDispatch } from "@/lib/redux/hooks";
import { fetchPageWithConfig } from "@/lib/redux/features/pageSlice";
import { runScript } from "@/lib/runScript/runScript";
import { Component } from "@/lib/ComponentBuilders/Component";
import { useScriptActions } from "@/hooks/useScriptActions";
import { useScriptConnectionActions } from "@/hooks/useScriptConnectionActions"; */

export const usePublicPageViewer = () => {
  const params = useParams();
  /*   const dispatch = useAppDispatch(); */
  const pageId = params.pageId as string;

  /*   const { ConectionConfig } = useScriptConnectionActions();
  const scriptContext = useScriptActions(); */
  /*   const scriptContextRef = useRef(scriptContext); */

  const [componentStruct, setComponentStruct] = useState<Component | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isAccessDenied, setIsAccessDenied] = useState(false);

  /*   useEffect(() => {
    scriptContextRef.current = scriptContext;
  }, [scriptContext]); */

  /*  useEffect(() => {
    let isMounted = true;

    const loadPublicPage = async () => {
      // Reiniciamos estados al cambiar de página
      setIsAccessDenied(false);
      setComponentStruct(null);

      if (!pageId) return;

      try {
        setIsLoading(true);

        const actionResult = await dispatch(fetchPageWithConfig(pageId));

        // Verificamos si la petición falló técnicamente
        if (actionResult.meta.requestStatus === "rejected") {
          throw new Error("Error técnico al obtener la página");
        }

        const data = actionResult.payload as any;

        // --- VALIDACIÓN DE ACCESO ---
        // Si data es null (gracias a maybeSingle), significa Privado o No Existe.
        if (!data) {
          if (isMounted) setIsAccessDenied(true);
          return; // Salimos silenciosamente, sin lanzar Error
        }

        const { js_script, sql_script, dashboard_config } = data;

        // 2. Conectar a la Base de Datos del Cliente
        if (dashboard_config && dashboard_config.type) {
          // Pasamos false para no intentar guardar en Redux del Dashboard inexistente
          await ConectionConfig(dashboard_config, false);
        }

        // 3. Ejecutar el Script
        if (js_script) {
          const { result } = await runScript(
            js_script,
            sql_script || "",
            scriptContextRef.current
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
  }, []); */

  return {
    componentStruct,
    isLoading,
    isAccessDenied,
  };
};
