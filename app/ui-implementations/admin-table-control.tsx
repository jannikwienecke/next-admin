"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useAdminState } from "../provider/state";
import { AdminTableViewOptions } from "./admin-table-view-options";

export interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function AdminTableControl<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { control, handleSearchChange, query } = useAdminState();

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* SEARCH CONTROL */}
        <Input
          autoFocus
          placeholder={control.search.placeholder}
          value={query}
          onChange={handleSearchChange}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* {table.getColumn("status") && (
          <AdminTableFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <AdminTableFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <AdminTableViewOptions table={table} />
    </div>
  );
}
