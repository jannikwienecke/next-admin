"use client";

import React from "react";

import {
  IDataValue,
  ModelSchema,
  TableFilterProps,
} from "../client/admin-utils/base-types";
import {
  StateMachineProvider,
  StateProvider,
  useAdminState,
} from "../client/provider/state";
import { AdminFormSheet } from "./admin-form-sheet";
import { AdminLayout } from "./admin-layout";
import { AdminPageHeader } from "./admin-page-header";
import { AdminTable } from "./admin-table";
import { clientConfig } from "@/app/index.client";

export const AdminDashboard = (props: {
  data: IDataValue[];
  modelSchema: ModelSchema;
  filters: TableFilterProps;
}) => {
  return (
    <StateMachineProvider>
      <StateProvider>
        <AdminPage {...props} />
      </StateProvider>
    </StateMachineProvider>
  );
};

const AdminPage = (props: {
  data: IDataValue[];
  modelSchema: ModelSchema;
  filters: TableFilterProps;
}) => {
  const { send, data, columns, routing } = useAdminState();
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
        filters: props.filters,
      },
    });
  }, [props.data, props.filters, props.modelSchema, query, send, view]);

  return (
    <AdminLayout>
      <>
        {!data.length && props.data.length ? (
          <></>
        ) : (
          <>
            <AdminFormSheet />

            <div className="hidden h-full flex-1 flex-col space-y-8 py-8 px-4 md:flex">
              <AdminPageHeader />

              <AdminTable />
            </div>
          </>
        )}
      </>
    </AdminLayout>
  );
};
