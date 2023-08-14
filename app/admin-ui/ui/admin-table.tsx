import { DataTable } from "@/components/container/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useAdminState } from "../client/provider/state";
import { AdminTableControl } from "./admin-table-control";
import { AdminTablePagination } from "./admin-table-pagination";
import { AdminTableRowActions } from "./admin-table-row-actions";

export const AdminTable = () => {
  const { data, columns, emiiter } = useAdminState();

  const columnActions: ColumnDef<any> = {
    id: "actions",
    cell: ({ row }) => (
      <AdminTableRowActions
        items={[
          {
            id: "edit",
            isChecked: false,
            label: "Edit",
            onCheck: () => emiiter.clickEdit(row.original),
          },
          {
            id: "delete",
            isChecked: false,
            label: "Delete",
            onCheck: () => emiiter.clickDelete(row.original),
          },
        ]}
      />
    ),
  };

  const _columns = [...columns, columnActions];

  return (
    <>
      <DataTable
        data={data}
        columns={_columns}
        components={{
          Toolbar: AdminTableControl,
          Pagination: AdminTablePagination,
        }}
      />
    </>
  );
};
