"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  Updater,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { DataTablePaginationProps } from "../../app/admin-ui/ui/admin-table-pagination";
import { IDataValue } from "@/app/admin-ui/client/admin-utils/base-types";

interface DataTableProps<TData extends IDataValue, TValue> {
  columns: ColumnDef<TData>[];
  data: TData[];
  onRowSelectionChange?: (rowSelection: Record<string, boolean>) => void;
  onSortingChange?: (sorting: {
    id: string;
    direction: "asc" | "desc";
  }) => void;
}

export function DataTable<TData extends IDataValue, TValue>({
  columns,
  data,
  components = {},
  onSortingChange,
}: DataTableProps<TData, TValue> & {
  components?: {
    Pagination?: React.ComponentType<DataTablePaginationProps<TData>>;
    Toolbar?: React.ComponentType<DataTablePaginationProps<TData>>;
  };
}) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const handleSortingChange = (props: Updater<SortingState>) => {
    setSorting(props);
  };

  const onSortingChangeRef = React.useRef(onSortingChange);
  React.useEffect(() => {
    if (onSortingChangeRef.current && sorting.length) {
      onSortingChangeRef.current({
        id: sorting[0].id,
        direction: sorting[0].desc === true ? "desc" : "asc",
      });
    }
  }, [sorting]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (sorting) => handleSortingChange(sorting),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  // return <></>;
  return (
    <div className="space-y-4">
      {components.Toolbar ? <components.Toolbar table={table} /> : null}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                // row.cell

                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {components.Pagination ? <components.Pagination table={table} /> : null}
    </div>
  );
}
