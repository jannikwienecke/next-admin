"use client";

import { DataTable } from "@/components/container/data-table";
import React from "react";
import { IDataValue, ModelSchema } from "../admin-utils/base-types";
import { clientConfig } from "../config/index.client";
import { useMachine } from "../provider/hooks";
import { StateMachineProvider } from "../provider/state";
import { AdminLayout } from "./admin-layout";
import { AdminTableControl } from "./admin-table-control";
import { AdminTablePagination } from "./admin-table-pagination";

export const AdminTable = (props: {
  data: IDataValue[];
  modelSchema: ModelSchema;
}) => {
  return (
    <StateMachineProvider>
      <AdminPage {...props} />
    </StateMachineProvider>
  );
};

const AdminPage = (props: { data: IDataValue[]; modelSchema: ModelSchema }) => {
  const { send, data, columns, routing } = useMachine();
  const { view, query } = routing;

  React.useEffect(() => {
    send({
      type: "INIT_STATE",
      data: {
        config: clientConfig,
        modelSchema: props.modelSchema,
        query,
        data: props.data,
        view,
      },
    });
  }, [props.data, props.modelSchema, query, send, view]);

  return (
    <AdminLayout>
      <>
        {!data.length && props.data.length ? (
          <></>
        ) : (
          <DataTable
            data={data}
            columns={columns}
            components={{
              Toolbar: AdminTableControl,
              Pagination: AdminTablePagination,
            }}
          />
        )}
      </>
    </AdminLayout>
  );
};
