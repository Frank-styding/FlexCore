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
import { Checkbox } from "@/components/ui/checkbox"; // Importamos Checkbox
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  Trash2,
  Pencil,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TableProps = Component & {
  context: Context;
  data: {
    columns: { accessorKey: string; header: string; enableSorting?: boolean }[];
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
  const [itemsRef, setItems, tableData] = useDynamicValue(
    context,
    data.items,
    []
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({}); // Estado para selección
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: config.pageSize || 5,
  });

  // --- LÓGICA DE EXPORTACIÓN ---
  const handleExport = () => {
    if (!Array.isArray(tableData) || tableData.length === 0) return;

    // Obtenemos headers
    const headers = data.columns.map((c) => c.header).join(",");
    const keys = data.columns.map((c) => c.accessorKey);

    // Convertimos filas
    const rows = tableData
      .map((row) => keys.map((k) => JSON.stringify(row[k] || "")).join(","))
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

    // 1. Columna de Checkbox (Si está activa)
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
            onClick={(e) => e.stopPropagation()} // Evitar click en fila
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      });
    }

    // 2. Columnas de Datos
    const dataCols = (data?.columns ?? []).map((col) => ({
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
    }));
    baseCols.push(...dataCols);

    // 3. Columna de Acciones (Editar/Eliminar)
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
  }, [data.columns, config.enableRowSelection, events]);

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
        setRowSelection({}); // Limpiamos selección al cambiar datos
      },
      getData: () => itemsRef.current,
      getSelectedRows: () =>
        table.getSelectedRowModel().rows.map((r) => r.original),
    }),
    [setItems, itemsRef, table]
  );
  useComponentRegistration(context, "table", id, exposedMethods);

  return (
    <div className={cn("w-full flex flex-col gap-4", config.className)}>
      {/* HEADER BAR: Bulk Actions y Export */}
      <div className="flex items-center justify-between min-h-[40px]">
        <div className="flex items-center gap-2">
          {/* Si hay filas seleccionadas, mostramos la barra de acciones masivas */}
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
                  setRowSelection({}); // Limpiar selección tras acción
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Selección
              </Button>
            </div>
          )}
        </div>

        {/* Botón Exportar */}
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
