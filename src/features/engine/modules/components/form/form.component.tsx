import { useMemo } from "react";
// Asegúrate de que esta ruta sea correcta hacia tu componente UI base
import { DynamicForm as UIForm } from "@/components/shared/DynamicForm";

import { useScriptError } from "@/features/engine/hooks/useConnectionError";
import { useComponentRegistration } from "@/features/engine/hooks/useComponentRegistration";
import { useDynamicValue } from "@/features/engine/hooks/useDynamicValue";

import { IComponent, IContext } from "../../types/component.type";
import { IFormProps } from "./form.definition";

export const DynamicFormComponent = ({
  config = {},
  events,
  context,
  id,
  data,
}: IComponent & IFormProps & { context: IContext }) => {
  const execute = useScriptError();

  // 1. Valores por defecto dinámicos
  // Esto permite hacer binding: defaultValues: table.selectedRow
  const [_, __, defaultValues] = useDynamicValue(
    context,
    data?.defaultValues,
    {}
  );

  // 2. Manejo del Submit
  const handleOnSubmit = (formData: any) => {
    if (events?.onSubmit) {
      execute(events.onSubmit, formData, context);
    }
  };

  // 3. Registro (Opcional, por si quieres métodos como form.reset() en el futuro)
  const exposedMethods = useMemo(() => ({}), []);
  useComponentRegistration(context, "form", id, exposedMethods);

  return (
    <UIForm
      // Configuración visual
      className={config.className}
      /*       classNameForm={config.classNameForm} */
      /*       title={config.title} */
      /*       description={config.description} */
      confirmName={config.confirmLabel} // Mapeo de nombres si tu UI usa 'confirmName'
      /*       cancelName={config.cancelLabel} */
      // Datos del formulario
      schema={data?.schema}
      fields={data?.fields || []}
      defaultValues={defaultValues}
      // Eventos
      onSubmit={handleOnSubmit}
    />
  );
};
