export const ZodType = `

type ZodSafeParseReturnType<Output> = 
  | { success: true; data: Output } 
  | { success: false; error: { issues: any[]; message: string } };

interface ZodType<Output = any, Input = Output> {
  parse(data: unknown): Output;
  safeParse(data: unknown): ZodSafeParseReturnType<Output>;
  optional(): ZodType<Output | undefined, Input | undefined>;
  nullable(): ZodType<Output | null, Input | null>;
  or<T extends ZodType>(option: T): ZodType<Output | T["_output"], Input | T["_input"]>;
  and<T extends ZodType>(option: T): ZodType<Output & T["_output"], Input & T["_input"]>;
  _output: Output;
  _input: Input;
}

interface ZodString extends ZodType<string> {
  email(message?: string): ZodString;
  min(length: number, message?: string): ZodString;
  max(length: number, message?: string): ZodString;
  url(message?: string): ZodString;
  uuid(message?: string): ZodString;
  regex(regex: RegExp, message?: string): ZodString;
  nonempty:()=>ZodString
}

interface ZodNumber extends ZodType<number> {
  min(value: number, message?: string): ZodNumber;
  max(value: number, message?: string): ZodNumber;
  int(message?: string): ZodNumber;
  positive(message?: string): ZodNumber;
}

interface ZodArray<T extends ZodType> extends ZodType<T["_output"][], T["_input"][]> {
  element: T;
  min(length: number, message?: string): this;
  max(length: number, message?: string): this;
}

interface ZodObject<T extends Record<string, ZodType>> extends ZodType<
  { [K in keyof T]: T[K]["_output"] },
  { [K in keyof T]: T[K]["_input"] }
> {
  shape: T;
  extend<U extends Record<string, ZodType>>(augmentation: U): ZodObject<T & U>;
  pick<K extends keyof T>(mask: Record<K, true>): ZodObject<Pick<T, K>>;
  omit<K extends keyof T>(mask: Record<K, true>): ZodObject<Omit<T, K>>;
  partial(): ZodObject<{ [K in keyof T]: T[K] extends ZodType<infer O, infer I> ? ZodType<O | undefined, I | undefined> : never }>;
}

// Declaración del objeto 'z' y sus métodos
declare const z: {
  string: (params?: { required_error?: string; invalid_type_error?: string }) => ZodString;
  number: (params?: { required_error?: string; invalid_type_error?: string }) => ZodNumber;
  boolean: (params?: { required_error?: string; invalid_type_error?: string }) => ZodType<boolean>;
  date: () => ZodType<Date>;
  any: () => ZodType<any>;
  unknown: () => ZodType<unknown>;
  null: () => ZodType<null>;
  undefined: () => ZodType<undefined>;
  literal: <T extends string | number | boolean>(value: T) => ZodType<T>;
  union: <T extends [ZodType, ...ZodType[]]>(options: T) => ZodType<T[number]["_output"]>;
  array: <T extends ZodType>(schema: T) => ZodArray<T>;
  object: <T extends Record<string, ZodType>>(shape: T) => ZodObject<T>;
  enum: <U extends string, T extends [U, ...U[]]>(values: T) => ZodType<T[number]>;
  nativeEnum: <T extends EnumLike>(enumObj: T) => ZodType<T[keyof T]>;
  
  // Utilidad para inferencia de tipos dentro del script
  infer: <T extends ZodType>(schema: T) => T["_output"];
};

// Hack para permitir "type MyType = z.infer<typeof schema>"
declare namespace z {
    export type infer<T extends ZodType> = T["_output"];
}

type EnumLike = { [k: string]: string | number; [k: number]: string };`;
