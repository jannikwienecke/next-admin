import { DataTable } from "@/components/container/data-table";
import { useAdmin } from "../provider/hooks";
import { AdminTableControl } from "./admin-table-control";
import { AdminTablePagination } from "./admin-table-pagination";
import { ColumnDef } from "@tanstack/react-table";
import { AdminTableRowActions } from "./admin-table-row-actions";
import { IDataValue } from "../admin-utils/base-types";

export const AdminTable = () => {
  const { data, columns, emiiter } = useAdmin();

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
