"use client";

import {
  ControllerRenderProps,
  useForm,
  UseFormSetError,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { memo, useEffect, useState } from "react";
import { IconPicker } from "./IconPicker";

export type FieldConfig = {
  name: string;
  label: string;
  type: "text" | "number" | "email" | "select" | "date" | "icon";
  placeholder?: string;
  options?: { label: string; value: string }[]; // Solo para selects
  className?: string; // Para controlar el ancho (col-span-1, etc.)
};

export interface DynamicFormProps {
  schema: z.ZodType<any, any>; // El esquema de validación Zod
  defaultValues?: any; // Los datos iniciales
  fields?: FieldConfig[]; // La lista de campos a dibujar
  type?: "new" | "update";
  confirmName?: string;
  submitLabel?: string;
  onSubmit?: (data: any, setError: UseFormSetError<any>) => void;
  className?: string;
  hideWhenEmpty?: boolean;
}

const FormDynamicInput = memo(
  ({
    field,
    fieldConfig,
  }: {
    field: ControllerRenderProps<any, string>;
    fieldConfig: FieldConfig;
  }) => {
    switch (fieldConfig.type) {
      case "icon":
        return (
          <IconPicker
            value={field.value}
            onChange={field.onChange}
            placeholder={fieldConfig.placeholder}
          />
        );
      case "select":
        return (
          <Select onValueChange={field.onChange} value={field.value ?? ""}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={fieldConfig.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {fieldConfig.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            {...field}
            value={field.value ?? ""}
            type={fieldConfig.type}
            placeholder={fieldConfig.placeholder}
            onChange={(e) => {
              const val =
                fieldConfig.type === "number"
                  ? e.target.value == ""
                    ? ""
                    : Number(e.target.value)
                  : e.target.value;
              field.onChange(val);
            }}
          />
        );
    }
  }
);

FormDynamicInput.displayName = "FormDynamicInput";

export function DynamicForm({
  schema,
  defaultValues = {},
  fields = [],
  onSubmit,
  submitLabel,
  confirmName,
  className,
  hideWhenEmpty,
}: DynamicFormProps) {
  const [show, setShow] = useState(false);

  const form = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const defaultValuesJson = JSON.stringify(defaultValues);

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);
    }
  }, [defaultValuesJson, form]);

  const handleOnChange = () => {
    setShow(JSON.stringify(form.getValues()) != JSON.stringify(defaultValues));
  };

  const handleReset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    form.reset(defaultValues);
    setShow(false);
  };
  const handleSubmitWrapper = (data: any) => {
    if (onSubmit) {
      onSubmit(data, form.setError);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmitWrapper)}
        onChange={handleOnChange}
        className="space-y-6"
      >
        {/* GRID DINÁMICO */}
        <div className={`grid grid-cols-1 ${className} gap-4`}>
          {fields.map((fieldConfig) => (
            <FormField
              key={fieldConfig.name}
              control={form.control}
              name={fieldConfig.name}
              render={({ field }) => (
                <FormItem className={fieldConfig.className || "col-span-1"}>
                  <FormLabel>{fieldConfig.label}</FormLabel>
                  <FormControl>
                    <FormDynamicInput field={field} fieldConfig={fieldConfig} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        {(show || !hideWhenEmpty) && (
          <div className="flex w-full gap-4">
            <Button
              type="button"
              variant="outline"
              className=" md:w-auto"
              onClick={handleReset}
            >
              Cancelar
            </Button>
            <Button type="submit" className=" md:w-auto">
              {submitLabel} {confirmName}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
