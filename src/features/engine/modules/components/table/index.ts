import { IComponentModule } from "../../types/IComponentModule";
import { Table } from "./table.builder";
import { DynamicTable } from "./table.component";
import { TABLE_CONTEXT_EVENT, TABLE_TYPE_DEFINITION } from "./table.definition";

export const TABLE: IComponentModule = {
  name: "Table",
  component: DynamicTable,
  builder: Table,
  eventsDefinition: TABLE_CONTEXT_EVENT,
  builderDefinition: TABLE_TYPE_DEFINITION,
};
