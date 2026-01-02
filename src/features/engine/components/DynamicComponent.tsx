import { JSX, memo, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { IComponent } from "../modules/types/component.type";
import { IEngine } from "../modules";

const RecursiveComponent = memo(
  ({
    componentMap,
    data,
    context,
  }: {
    componentMap: Record<string, (...data: any) => JSX.Element>;
    data?: IComponent;
    context: any;
  }) => {
    // 1. Preparamos los datos seguros MEMORIZADOS
    const safeData = useMemo(() => {
      if (!data) return null;

      // Clonamos superficialmente para no mutar el objeto original del engine
      const clone = { ...data };

      // Aseguramos ID estable (si el engine no lo manda, lo creamos una vez)
      if (!clone.id) clone.id = uuid();

      // Limpieza de estilos
      if (clone.config && typeof clone.config.style === "string") {
        clone.config = { ...clone.config, style: undefined };
      }

      return clone;
    }, [data]); // Solo se recalcula si 'data' cambia referencialmente

    if (!safeData) return null;

    const TargetComponent = componentMap[safeData.type];
    if (!TargetComponent) return null;

    return (
      <TargetComponent {...safeData} context={context}>
        {safeData.subComponents &&
          (Array.isArray(safeData.subComponents) ? (
            safeData.subComponents.map((item) => {
              // Nota: Lo ideal es que el Engine asigne IDs, pero si no:
              const itemId = item.id || uuid();
              return (
                <RecursiveComponent
                  data={{ ...item, id: itemId }} // Pasamos el ID asegurado
                  key={itemId}
                  context={context}
                  componentMap={componentMap}
                />
              );
            })
          ) : (
            <RecursiveComponent
              data={safeData.subComponents}
              context={context}
              componentMap={componentMap}
            />
          ))}
      </TargetComponent>
    );
  }
);
RecursiveComponent.displayName = "RecursiveComponent";

export const DynamicComponent = memo(
  ({ engine, data }: { engine?: IEngine | null; data?: IComponent }) => {
    if (!engine) return null;
    const { context } = engine.globalContext.context;
    const componentMap = engine.ComponentMap;
    return (
      <RecursiveComponent
        componentMap={componentMap}
        data={data}
        context={context}
      />
    );
  }
);

DynamicComponent.displayName = "DynamicComponent";
