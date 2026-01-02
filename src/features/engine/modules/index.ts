import { IComponentModule } from "./types/IComponentModule";
import { ComponentModules } from "./components";
import { ComponentType, ContextType } from "./types/component.definition";
import { FunctionModules } from "./functions";
import { IFunctionModule } from "./types/IFuntionsModule";
import { createContext } from "./lib/createContext";
import { JSX } from "react";

interface ICompDefinitions {
  components: Record<string, any>;
  eventsDefinition: string;
  builderDefinition: string;
  contextEvents: Record<string, string>;
  context: Record<string, any>;
}

interface IFunDefinitions {
  context: Record<string, any>;
  definition: string;
}

export interface IEngineOptions {
  include?: string[];
  exclude?: string[];
  includeFunctions?: string[];
  excludeFunctions?: string[];
}

function ProcessModule(
  prev: ICompDefinitions,
  curr: IComponentModule
): ICompDefinitions {
  prev.components[curr.name] = curr.component;
  prev.context[curr.name] = curr.builder;

  if (curr.eventsDefinition) {
    const defObj =
      typeof curr.eventsDefinition === "string"
        ? {
            definition: curr.eventsDefinition,
            key: curr.name.toLowerCase(),
            name: `I${curr.name}Map`,
          }
        : curr.eventsDefinition;

    const { definition, key, name } = defObj;

    prev.contextEvents[key] = name;
    prev.eventsDefinition += `\n${definition}\n`;
  }

  if (curr.builderDefinition) {
    prev.builderDefinition += `\n${curr.builderDefinition}\n`;
  }

  return prev;
}

function ProcessFunModule(prev: IFunDefinitions, curr: IFunctionModule) {
  prev.context[curr.name] = curr.func();
  prev.definition += curr.definition;
  return prev;
}

export interface IEngine {
  ComponentMap: Record<string, (data: any) => JSX.Element>;
  ModulesDefinition: string;
  globalContext: Record<string, any>;
  LoadedComponents: string[];
  LoadedFunctions: string[];
}

export const createEngine = (options: IEngineOptions = {}): IEngine => {
  let CompModuToProcess = [...ComponentModules];
  if (options.include && options.include.length > 0) {
    CompModuToProcess = CompModuToProcess.filter((mod) =>
      options.include!.includes(mod.name)
    );
  } else if (options.exclude && options.exclude.length > 0) {
    CompModuToProcess = CompModuToProcess.filter(
      (mod) => !options.exclude!.includes(mod.name)
    );
  }

  let functionsToProcess: any = [...FunctionModules];
  if (options.includeFunctions && options.includeFunctions.length > 0) {
    functionsToProcess = functionsToProcess.filter((func) =>
      options.includeFunctions!.includes(func.name)
    );
  } else if (options.excludeFunctions && options.excludeFunctions.length > 0) {
    functionsToProcess = functionsToProcess.filter(
      (func) => !options.excludeFunctions!.includes(func.name)
    );
  }

  const CompConfig = CompModuToProcess.reduce(ProcessModule, {
    components: {},
    eventsDefinition: "",
    builderDefinition: "",
    contextEvents: {},
    context: {},
  });

  const FunConfig = functionsToProcess.reduce(ProcessFunModule, {
    context: {},
    definition: "",
  });

  const definitions = [
    CompConfig.eventsDefinition,
    ContextType(CompConfig.contextEvents),
    ComponentType,
    CompConfig.builderDefinition,
    FunConfig.definition,
  ];

  const context = createContext();

  return {
    ComponentMap: CompConfig.components,
    ModulesDefinition: definitions.join("\n"),
    globalContext: {
      ...CompConfig.context,
      ...FunConfig.context,
      context,
    },
    LoadedComponents: CompModuToProcess.map((m) => m.name),
    LoadedFunctions: functionsToProcess.map((f) => f.name),
  };
};

export const DefaultEngine = createEngine();
