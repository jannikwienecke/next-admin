import { Dropdown } from "@/components/container/drop-down";
import { Table } from "@tanstack/react-table";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function AdminTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const items = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide()
    )
    .map((column) => {
      return {
        id: column.id,
        label: column.id,
        isChecked: column.getIsVisible(),
        onCheck: (isChecked?: boolean) => column.toggleVisibility(!!isChecked),
        isCheckbox: true,
      };
    });

  return <Dropdown items={items} title="View" />;
}
