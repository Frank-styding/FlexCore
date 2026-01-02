import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { ChevronRight } from "lucide-react";

// Imports de UI (ajusta rutas según tu proyecto)
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Imports de Engine
import { useComponentRegistration } from "@/features/engine/hooks/useComponentRegistration";
import { useScriptError } from "@/features/engine/hooks/useConnectionError";
import { IComponent, IContext } from "../../types/component.type";
import { INavigationProps, INavigationRoute } from "./navigation.definition";
import { DynamicComponent } from "@/features/engine/components/DynamicComponent";

// --- Helpers de Lógica de Rutas ---

const findRouteTrail = (
  allRoutes: INavigationRoute[],
  pathString: string
): INavigationRoute[] => {
  if (!pathString) return [];
  const ids = pathString.split("/");
  const trail: INavigationRoute[] = [];
  let currentLevel = allRoutes;

  for (const id of ids) {
    const found = currentLevel.find((r) => r.id === id);
    if (!found) break;
    trail.push(found);
    if (found.subRoutes) {
      currentLevel = found.subRoutes;
    } else {
      break;
    }
  }
  return trail;
};

const resolveEffectivePath = (
  allRoutes: INavigationRoute[],
  inputPath: string
): string => {
  const trail = findRouteTrail(allRoutes, inputPath);

  if (trail.length === 0) return "";

  let lastNode = trail[trail.length - 1];
  let effectivePath = inputPath;

  // Si es un nodo intermedio sin hijos visuales pero con subrutas, bajar al primer hijo
  while (
    (!lastNode.children || lastNode.children.length === 0) &&
    lastNode.subRoutes &&
    lastNode.subRoutes.length > 0
  ) {
    const firstChild = lastNode.subRoutes[0];
    effectivePath = `${effectivePath}/${firstChild.id}`;
    lastNode = firstChild;
    trail.push(firstChild);
  }

  return effectivePath;
};

// --- Componente Principal ---

export const DynamicNavigation = ({
  config = {},
  events,
  context,
  id,
  data,
}: IComponent & INavigationProps & { context: IContext }) => {
  const execute = useScriptError();
  const routes = data?.routes || [];

  // --- Estado Inicial (URL Hash o Default) ---
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const effective = resolveEffectivePath(routes, hash);
        if (effective) {
          if (effective !== hash) {
            window.history.replaceState(null, "", `#${effective}`);
          }
          return effective;
        }
      }
    }
    const defaultRoute = routes[0];
    const defaultEffective = resolveEffectivePath(
      routes,
      defaultRoute?.id || ""
    );
    return defaultEffective;
  });

  const [routeData, setRouteData] = useState<any>(() => {
    if (typeof window !== "undefined") return window.history.state || null;
    return null;
  });

  // --- Cálculos Derivados ---
  const activeTrail = useMemo(
    () => findRouteTrail(routes, currentPath),
    [routes, currentPath]
  );

  const activeNode = activeTrail[activeTrail.length - 1];

  // --- Lógica de Navegación ---
  const navigateTo = (
    route: INavigationRoute,
    parentPath: string = "",
    extraData: any = null
  ) => {
    const targetPath = parentPath ? `${parentPath}/${route.id}` : route.id;
    const effectivePath = resolveEffectivePath(routes, targetPath);

    if (
      effectivePath === currentPath &&
      JSON.stringify(extraData) === JSON.stringify(routeData)
    )
      return;

    window.history.pushState(extraData, "", `#${effectivePath}`);
    setCurrentPath(effectivePath);
    setRouteData(extraData);

    // Disparar evento de script
    if (events?.onNavigate) {
      execute(events.onNavigate, effectivePath, context);
    }
  };

  // --- Efectos: Escuchar cambios de URL (Popstate/Hashchange) ---
  useEffect(() => {
    const handleLocationChange = (e?: PopStateEvent | HashChangeEvent) => {
      const hash = window.location.hash.replace("#", "");
      const effective = resolveEffectivePath(routes, hash);

      if (effective) {
        setCurrentPath(effective);
        const newState =
          e && "state" in e ? (e as PopStateEvent).state : window.history.state;
        setRouteData(newState);
      } else if (!hash && routes.length > 0) {
        // Fallback a home si se borra el hash
        const defaultEffective = resolveEffectivePath(routes, routes[0].id);
        setCurrentPath(defaultEffective);
        setRouteData(null);
      }
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, [routes]);

  // --- Registro de API Pública (nav.navigate...) ---
  const exposedMethods = useMemo(
    () => ({
      navigate: (path: string, payload?: any) => {
        const effective = resolveEffectivePath(routes, path);
        if (effective) {
          window.history.pushState(payload || null, "", `#${effective}`);
          setCurrentPath(effective);
          setRouteData(payload || null);
        }
      },
      getCurrentPath: () => currentPath,
      getRouteData: () => routeData,
    }),
    [currentPath, routeData, routes]
  );

  useComponentRegistration(context, "nav", id, exposedMethods);

  // --- Renderizado de Capas de Navegación (Tabs) ---
  const navigationLayers = useMemo(() => {
    const layers = [routes];
    activeTrail.forEach((node) => {
      if (node.subRoutes && node.subRoutes.length > 0) {
        layers.push(node.subRoutes);
      }
    });
    return layers;
  }, [routes, activeTrail]);

  // --- Renderizado de Contenido Activo ---
  const activeContent = useMemo(() => {
    if (!activeNode?.children) return null;
    return (
      <div
        key={currentPath} // Forzar re-mount para animación
        className="animate-in fade-in zoom-in-95 duration-200 h-full"
      >
        {activeNode.children.map((item) => {
          const componentData = { ...item, id: item.id || uuid() };
          return (
            <DynamicComponent
              key={componentData.id}
              data={componentData}
              context={context}
            />
          );
        })}
      </div>
    );
  }, [activeNode, currentPath, context]);

  // --- Renderizado Final ---
  const showBreadcrumb = config.showBreadcrumb !== false;
  const showTabs = config.showTabs !== false;
  const showHeader = showBreadcrumb || showTabs;

  return (
    <div
      className={cn("flex flex-col gap-4 w-full h-full", config.className)}
      style={config.style}
    >
      {showHeader && (
        <div className="flex flex-col gap-3 border-b pb-4 bg-background/95 backdrop-blur sticky top-0 z-20 px-1 pt-2">
          {/* Breadcrumb Area */}
          {showBreadcrumb && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigateTo(routes[0])}
                  >
                    {config.homeLabel || "Inicio"}
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {activeTrail.map((node, index) => {
                  const isLast = index === activeTrail.length - 1;
                  const pathUntilHere = activeTrail
                    .slice(0, index + 1)
                    .map((n) => n.id)
                    .join("/");

                  return (
                    <div
                      key={node.id}
                      className="flex items-center gap-1.5 text-muted-foreground/60"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="font-semibold text-primary">
                            {node.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            className="cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => {
                              // Navegación manual vía breadcrumb
                              window.history.pushState(
                                null,
                                "",
                                `#${pathUntilHere}`
                              );
                              setCurrentPath(pathUntilHere);
                              setRouteData(null);
                            }}
                          >
                            {node.label}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          )}

          {/* Tabs Area */}
          {showTabs && (
            <div className="flex flex-col gap-2">
              {navigationLayers.map((layerRoutes, layerIndex) => {
                const isRoot = layerIndex === 0;
                // Calculamos el padre de esta capa para construir rutas relativas
                const parentPath = activeTrail
                  .slice(0, layerIndex)
                  .map((n) => n.id)
                  .join("/");

                return (
                  <div
                    key={layerIndex}
                    className={cn(
                      "flex flex-wrap gap-2 transition-all animate-in slide-in-from-left-2 duration-300",
                      !isRoot && "pl-2 border-l-2 border-border/50 ml-1"
                    )}
                  >
                    {layerRoutes.map((route) => {
                      const isActive = activeTrail[layerIndex]?.id === route.id;
                      return (
                        <Button
                          key={route.id}
                          variant={
                            isActive
                              ? isRoot
                                ? "default"
                                : "secondary"
                              : "ghost"
                          }
                          size={isRoot ? "default" : "sm"}
                          onClick={() => navigateTo(route, parentPath, null)}
                          className={cn(
                            "transition-all",
                            !isRoot && "h-7 text-xs",
                            isActive && "shadow-sm"
                          )}
                        >
                          {route.label}
                        </Button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-auto relative">
        {activeContent}
      </div>
    </div>
  );
};
