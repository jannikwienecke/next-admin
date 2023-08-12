"use client";

import React from "react";
import { IDataValue, ModelSchema } from "../admin-utils/base-types";
import { clientConfig } from "../config/index.client";
import { useAdmin } from "../provider/hooks";
import { StateMachineProvider } from "../provider/state";
import { AdminFormSheet } from "./admin-form-sheet";
import { AdminLayout } from "./admin-layout";
import { AdminPageHeader } from "./admin-page-header";
import { AdminTable } from "./admin-table";

export const AdminDashboard = (props: {
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
  const { send, data, columns, routing } = useAdmin();
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
