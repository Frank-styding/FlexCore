/* eslint-disable react-hooks/immutability */
import { Component, Context } from "@/lib/ComponentBuilders/Component";
import { useDynamicValue } from "@/components/DynamicComponents/useDynamicValue";
import { useMemo, useState } from "react";
import { useComponentRegistration } from "../useComponentRegistration";
import { cn } from "@/lib/utils";

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
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  Trash2,
  Pencil,
} from "lucide-react";

type TableProps = Component & {
  context: Context;
  data: {
    // Recibimos los wrappers dinámicos
    columns: any;
    items: any;
  };
  config: {
    className?: string;
    pageSize?: number;
    enableRowSelection?: boolean;
    enableExport?: boolean;
  };
};

export const DynamicTable = ({
  config,
  events,
  context,
  id,
  data,
}: TableProps) => {
  // 1. Hook para ITEMS (Data) -> Obtenemos reloadItems
  const [itemsRef, setItems, tableData, reloadItems] = useDynamicValue(
    context,
    data.items,
    []
  );

  // 2. Hook para COLUMNAS (Nuevo) -> Las columnas ahora son dinámicas
  const [colsRef, setCols, tableColumns] = useDynamicValue(
    context,
    data.columns,
    []
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: config.pageSize || 5,
  });

  // --- LÓGICA DE EXPORTACIÓN ---
  const handleExport = () => {
    if (!Array.isArray(tableData) || tableData.length === 0) return;

    // Usamos tableColumns en lugar de data.columns estático
    const headers = tableColumns.map((c: any) => c.header).join(",");
    const keys = tableColumns.map((c: any) => c.accessorKey);

    const rows = tableData
      .map((row) =>
        keys.map((k: any) => JSON.stringify(row[k] || "")).join(",")
      )
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `export_${id}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- CONSTRUCCIÓN DE COLUMNAS ---
  const columns = useMemo<ColumnDef<any>[]>(() => {
    const baseCols: ColumnDef<any>[] = [];

    // Columna de Checkbox
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

    // Columnas de Datos (Usamos tableColumns resuelto por el hook)
    const dataCols = (Array.isArray(tableColumns) ? tableColumns : []).map(
      (col: any) => ({
        accessorKey: col.accessorKey,
        header: ({ column }: any) => {
          if (col.enableSorting) {
            return (
              <Button
                variant="ghost"
                onClick={() =>
                  column.toggleSorting(column.getIsSorted() === "asc")
                }
                className="-ml-4 h-8 data-[state=open]:bg-accent"
              >
                {col.header}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            );
          }
          return col.header;
        },
      })
    );
    baseCols.push(...dataCols);

    // Columna de Acciones
    if (events.onEdit || events.onDelete) {
      baseCols.push({
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              {events.onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:text-blue-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    events.onEdit?.(row.original, context);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {events.onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    events.onDelete?.(row.original, context);
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
  }, [tableColumns, config.enableRowSelection, events, context]); // Dependemos de tableColumns

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

  const exposedMethods = useMemo(
    () => ({
      setData: (newData: any[]) => {
        setItems(newData);
        setRowSelection({});
      },
      getData: () => itemsRef.current,
      getSelectedRows: () =>
        table.getSelectedRowModel().rows.map((r) => r.original),
      // 3. Exponemos el reload (recarga principalmente los items)
      reload: () => reloadItems(),
    }),
    [setItems, itemsRef, table, reloadItems]
  );

  useComponentRegistration(context, "table", id, exposedMethods);

  // Renderizado (Igual que antes, solo asegúrate de usar tableColumns si necesitas leer headers manualmente en export)
  return (
    <div className={cn("w-full flex flex-col gap-4", config.className)}>
      {/* ... El resto del JSX se mantiene igual ... */}
      {/* Solo asegúrate de copiar el JSX del archivo anterior completo aquí */}
      <div className="flex items-center justify-between min-h-[40px]">
        <div className="flex items-center gap-2">
          {selectedRows.length > 0 && events.onBulkDelete && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-sm text-muted-foreground border-r pr-3 mr-1">
                {selectedRows.length} seleccionados
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  const items = selectedRows.map((r) => r.original);
                  events.onBulkDelete?.(items, context);
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
                  className={
                    events.onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                  }
                  onClick={() => events.onRowClick?.(row.original, context)}
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
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </UITable>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <div className="text-sm text-muted-foreground">
          Página {table.getState().pagination.pageIndex + 1} de{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
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
