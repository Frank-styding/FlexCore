import { JSX } from "react";
import { IComponent } from "./component.type";

export interface IComponentModule {
  name: string;
  component: (data: any) => JSX.Element;
  builder: (data?: any) => IComponent;
  eventsDefinition: { key: string; name: string; definition: string };
  builderDefinition: string;
}
