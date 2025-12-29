/* eslint-disable react-hooks/immutability */
import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { useEffect, useMemo, useState } from "react";
import { useComponentRegistration } from "../useComponentRegistration";
import { cn } from "@/lib/utils";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { DynamicComponent } from "../DynamicComponent";

type RouteDef = {
  id: string;
  label: string;
  icon?: string;
  children?: any[];
  subRoutes?: RouteDef[];
};

type NavigationProps = Component & {
  context: Context;
  data: { routes: RouteDef[] };
  config: {
    className?: string;
    homeLabel?: string;
    showTabs?: boolean;
    showBreadcrumb?: boolean;
  };
};

// 1. Helper: Encuentra el array de objetos (trail)
const findRouteTrail = (
  allRoutes: RouteDef[],
  pathString: string
): RouteDef[] => {
  if (!pathString) return [];
  const ids = pathString.split("/");
  const trail: RouteDef[] = [];
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

// 2. Helper NUEVO: Resuelve la ruta efectiva (Drill-down recursivo)
// Si le das "settings" y settings no tiene contenido pero tiene hijos, devuelve "settings/profile"
const resolveEffectivePath = (
  allRoutes: RouteDef[],
  inputPath: string
): string => {
  const trail = findRouteTrail(allRoutes, inputPath);

  // Si la ruta no existe, devolvemos string vacío para ir al home
  if (trail.length === 0) return "";

  let lastNode = trail[trail.length - 1];
  let effectivePath = inputPath;

  // Mientras el nodo no tenga contenido visual PERO sí tenga subrutas...
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

export const DynamicNavigation = ({
  config,
  events,
  context,
  id,
  data,
  buildFuncs,
}: NavigationProps) => {
  // 3. Estado Inicial Inteligente
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");

      // A. Si hay hash, intentamos resolver la ruta completa (incluyendo redirecciones automáticas)
      if (hash) {
        const effective = resolveEffectivePath(data.routes, hash);
        if (effective) {
          // Si el usuario escribió #settings pero lo correcto es #settings/profile,
          // actualizamos la URL automáticamente sin recargar.
          if (effective !== hash) {
            window.history.replaceState(null, "", `#${effective}`);
          }
          return effective;
        }
      }
    }
    // B. Si no hay hash o es inválido, resolvemos la ruta por defecto (el primer item y sus hijos)
    const defaultRoute = data.routes[0];
    const defaultEffective = resolveEffectivePath(
      data.routes,
      defaultRoute?.id || ""
    );
    return defaultEffective;
  });

  const [routeData, setRouteData] = useState<any>(() => {
    if (typeof window !== "undefined") return window.history.state || null;
    return null;
  });

  const activeTrail = useMemo(
    () => findRouteTrail(data.routes, currentPath),
    [data.routes, currentPath]
  );

  const activeNode = activeTrail[activeTrail.length - 1];

  // 4. Navigate (actualizado para usar el helper)
  const navigateTo = (
    route: RouteDef,
    parentPath: string = "",
    extraData: any = null
  ) => {
    const targetPath = parentPath ? `${parentPath}/${route.id}` : route.id;

    // Usamos el helper para calcular si debemos ir más profundo automáticamente
    const effectivePath = resolveEffectivePath(data.routes, targetPath);

    if (
      effectivePath === currentPath &&
      JSON.stringify(extraData) === JSON.stringify(routeData)
    )
      return;

    window.history.pushState(extraData, "", `#${effectivePath}`);
    setCurrentPath(effectivePath);
    setRouteData(extraData);
    events.onNavigate?.(effectivePath, context);
  };

  // 5. Listener de Historial (actualizado para usar el helper)
  useEffect(() => {
    const handleLocationChange = (e?: PopStateEvent | HashChangeEvent) => {
      const hash = window.location.hash.replace("#", "");

      // Resolvemos la ruta real (manejando drill-down si el usuario borró parte de la url a mano)
      const effective = resolveEffectivePath(data.routes, hash);

      if (effective) {
        setCurrentPath(effective);
        if (e && "state" in e) {
          setRouteData(e.state);
        } else {
          setRouteData(window.history.state);
        }
      } else if (!hash && data.routes.length > 0) {
        // Fallback al inicio
        const defaultEffective = resolveEffectivePath(
          data.routes,
          data.routes[0].id
        );
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
  }, [data.routes]);

  useComponentRegistration(
    context,
    "nav",
    id,
    useMemo(
      () => ({
        // CORRECCIÓN: Renombramos 'data' a 'payload' para no chocar con 'data.routes'
        navigate: (path: string, payload?: any) => {
          // Ahora 'data.routes' se refiere correctamente a las props del componente
          const effective = resolveEffectivePath(data.routes, path);

          if (effective) {
            // Usamos 'payload' para el estado del historial
            window.history.pushState(payload || null, "", `#${effective}`);
            setCurrentPath(effective);
            setRouteData(payload || null);
          }
        },
        getCurrentPath: () => currentPath,
        getRouteData: () => routeData,
      }),
      [currentPath, routeData, data.routes]
    )
  );

  const navigationLayers = useMemo(() => {
    const layers = [data.routes];
    activeTrail.forEach((node) => {
      if (node.subRoutes && node.subRoutes.length > 0) {
        layers.push(node.subRoutes);
      }
    });
    return layers;
  }, [data.routes, activeTrail]);

  const activeContent = useMemo(() => {
    if (!activeNode?.children) return null;
    return (
      <div
        key={currentPath}
        className="animate-in fade-in zoom-in-95 duration-200 h-full"
      >
        {activeNode?.children.map((item) => {
          return (
            <DynamicComponent data={item} key={item.id} context={context} />
          );
        })}
      </div>
    );
  }, [activeNode, currentPath, buildFuncs, DynamicComponent, context]);

  return (
    <div className={cn("flex flex-col gap-4 w-full h-full", config.className)}>
      {/* HEADER */}
      {!(config.showBreadcrumb == false && config.showTabs == false) && (
        <div className="flex flex-col gap-3 border-b pb-4 bg-background/95 backdrop-blur sticky top-0 z-20 px-1 pt-2">
          {/* Breadcrumb */}
          {config.showBreadcrumb !== false && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigateTo(data.routes[0])}
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

          {/* Tabs */}
          {config.showTabs !== false && (
            <div className="flex flex-col gap-2">
              {navigationLayers.map((layerRoutes, layerIndex) => {
                const isRoot = layerIndex === 0;
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

      <div className="flex-1 min-h-0 overflow-auto relative">
        {activeContent}
      </div>
    </div>
  );
};
