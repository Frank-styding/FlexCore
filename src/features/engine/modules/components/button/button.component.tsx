import { useScriptError } from "@/features/engine/hooks/useConnectionError";
import { IComponent, IContext } from "../../types/component.type";
import { useDynamicValue } from "@/features/engine/hooks/useDynamicValue";
import { useMemo, useRef, useState } from "react";
import { useComponentRegistration } from "@/features/engine/hooks/useComponentRegistration";
import { Button } from "@/components/ui/button";
import { DynamicIcon, IconName } from "@/components/ui/dynamic-icon";
import { IButtonProps } from "./button.definition";
import { Loader2 } from "lucide-react";

export const DynamicButton = ({
  config = {},
  events, // El motor pasa los eventos aquí (gracias al builder)
  context,
  id,
  data,
}: IComponent & IButtonProps & { context: IContext }) => {
  const execute = useScriptError();

  // 1. Label Dinámico
  const [labelRef, setLabel, label] = useDynamicValue(
    context,
    data?.label,
    "Button"
  );

  // 2. Estados Locales
  const [isLoading, setIsLoading] = useState(config.loading || false);
  const [isDisabled, setIsDisabled] = useState(config.disabled || false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // 3. Helper para ejecutar eventos
  const handleEvent = (eventName: string, e: any) => {
    if (events && events[eventName]) {
      execute(events[eventName], e, context);
    }
  };

  // 4. Métodos Expuestos
  const exposedMethods = useMemo(
    () => ({
      setLabel: (value: string) => setLabel(value),
      getLabel: () => labelRef.current,
      setDisabled: (value: boolean) => setIsDisabled(value),
      setLoading: (value: boolean) => setIsLoading(value),
      click: () => buttonRef.current?.click(),
    }),
    [setLabel, labelRef]
  );

  useComponentRegistration(context, "btn", id, exposedMethods);

  const isButtonDisabled = isDisabled || isLoading;

  return (
    <Button
      ref={buttonRef}
      type={config.type || "button"}
      variant={config.variant || "default"}
      size={config.size || "default"}
      className={config.className}
      style={config.style}
      disabled={isButtonDisabled}
      onClick={(e) => handleEvent("onClick", e)}
      onMouseEnter={(e) => handleEvent("onMouseEnter", e)}
      onMouseLeave={(e) => handleEvent("onMouseLeave", e)}
      onFocus={(e) => handleEvent("onFocus", e)}
      onBlur={(e) => handleEvent("onBlur", e)}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        config.icon && (
          <DynamicIcon
            name={config.icon as IconName}
            className="mr-2 h-4 w-4"
          />
        )
      )}
      {label}
    </Button>
  );
};
