import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  Trash2,
  Pencil,
} from "lucide-react";

// UI Components
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Engine Hooks
import { useComponentRegistration } from "@/features/engine/hooks/useComponentRegistration";
import { useDynamicValue } from "@/features/engine/hooks/useDynamicValue";
import { useScriptError } from "@/features/engine/hooks/useConnectionError";

import { IComponent, IContext } from "../../types/component.type";
import { ITableProps, ITableColumn } from "./table.definition";

export const DynamicTable = ({
  config = {},
  events,
  context,
  id,
  data,
}: IComponent & ITableProps & { context: IContext }) => {
  const execute = useScriptError();

  // 1. Hook para ITEMS (Data Rows)
  // Nota: data.items viene del builder (que mapeó 'items' a 'data.items')
  const [itemsRef, setItems, tableData, reloadItems] = useDynamicValue<any[]>(
    context,
    data?.items,
    []
  );

  // 2. Hook para COLUMNAS
  const [colsRef, setCols, tableColumns] = useDynamicValue<ITableColumn[]>(
    context,
    data?.columns,
    []
  );

  // 3. Estado local de la tabla
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: config.pageSize || 10,
  });

  // --- Helpers ---

  // Exportar a CSV
  const handleExport = () => {
    if (!Array.isArray(tableData) || tableData.length === 0) return;

    // Usamos las columnas actuales para definir el orden y headers del CSV
    const currentCols = Array.isArray(tableColumns) ? tableColumns : [];

    const headers = currentCols.map((c) => c.header).join(",");
    const keys = currentCols.map((c) => c.accessorKey);

    const rows = tableData
      .map((row) =>
        keys
          .map((k) => {
            const val = row[k];
            // Manejo básico de valores nulos o objetos
            if (val === null || val === undefined) return "";
            if (typeof val === "object")
              return JSON.stringify(val).replace(/,/g, ";"); // Escapar comas
            return JSON.stringify(val);
          })
          .join(",")
      )
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `export_${id}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Definición de Columnas para TanStack Table ---
  const columns = useMemo<ColumnDef<any>[]>(() => {
    const baseCols: ColumnDef<any>[] = [];

    // 1. Columna de Selección (Checkbox)
    if (config.enableRowSelection) {
      baseCols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            onClick={(e) => e.stopPropagation()}
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      });
    }

    // 2. Columnas de Datos (Dinámicas)
    const dataCols = (Array.isArray(tableColumns) ? tableColumns : []).map(
      (col) => ({
        accessorKey: col.accessorKey,
        header: ({ column }: any) => {
          if (col.enableSorting) {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="-ml-4 h-8 data-[state=open]:bg-accent text-xs font-semibold"
              >
                {col.header}
                <ArrowUpDown className="ml-2 h-3 w-3" />
              </Button>
            );
          }
          return <span className="text-xs font-semibold">{col.header}</span>;
        },
        cell: ({ getValue }: any) => {
          // Aquí podrías agregar formateadores (date, currency) basados en col.format
          const val = getValue();
          return <span className="text-sm">{val}</span>;
        },
      })
    );
    baseCols.push(...dataCols);

    // 3. Columna de Acciones (Editar/Eliminar)
    if (events?.onEdit || events?.onDelete) {
      baseCols.push({
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-1">
              {events?.onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    execute(events.onEdit, row.original, context);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {events?.onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    execute(events.onDelete, row.original, context);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
      });
    }

    return baseCols;
  }, [tableColumns, config.enableRowSelection, events, context, execute]);

  // --- Instancia de la Tabla ---
  const table = useReactTable({
    data: Array.isArray(tableData) ? tableData : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      pagination,
      rowSelection,
    },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  // --- API Expuesta ---
  const exposedMethods = useMemo(
    () => ({
      setData: (newData: any[]) => {
        setItems(newData);
        setRowSelection({});
      },
      getData: () => itemsRef.current,
      getSelectedRows: () =>
        table.getSelectedRowModel().rows.map((r) => r.original),
      reload: () => reloadItems(),
    }),
    [setItems, itemsRef, table, reloadItems]
  );

  useComponentRegistration(context, "table", id, exposedMethods);

  // --- Renderizado ---
  return (
    <div
      className={cn("w-full flex flex-col gap-4", config.className)}
      style={config.style}
    >
      {/* Toolbar Superior */}
      <div className="flex items-center justify-between min-h-[40px]">
        <div className="flex items-center gap-2">
          {selectedRows.length > 0 && events?.onBulkDelete && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-sm text-muted-foreground border-r pr-3 mr-1">
                {selectedRows.length} seleccionados
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  const items = selectedRows.map((r) => r.original);
                  execute(events.onBulkDelete, items, context);
                  setRowSelection({});
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Selección
              </Button>
            </div>
          )}
        </div>

        {config.enableExport !== false && (
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
        )}
      </div>

      {/* Tabla */}
      <div className="rounded-md border bg-card">
        <UITable>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "transition-colors",
                    events?.onRowClick && "cursor-pointer hover:bg-muted/50"
                  )}
                  onClick={() => {
                    if (events?.onRowClick) {
                      execute(events.onRowClick, row.original, context);
                    }
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-end space-x-2 py-2">
        <div className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
