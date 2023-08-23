"use client";

import React from "react";

import { clientConfig } from "@/app/index.client";
import { usePrevious } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import {
  ClientConfigServer,
  IDataValue,
  ModelSchema,
  TableFilterProps,
} from "../client/admin-utils/base-types";
import {
  StateMachineProvider,
  StateProvider,
  useAdminState,
} from "../client/provider/state";
import { AdminCommandbar } from "./admin-commandbar";
import { AdminFormSheet } from "./admin-form-sheet";
import { AdminLayout } from "./admin-layout";
import { AdminLoadingOverlay } from "./admin-loading-overlay";
import { AdminPageHeader } from "./admin-page-header";
import { AdminTable } from "./admin-table";

export const AdminDashboard = (props: {
  data: IDataValue[];
  modelSchema: ModelSchema;
  filters: TableFilterProps;
  configForClient: ClientConfigServer;
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
  configForClient: ClientConfigServer;
}) => {
  const { send, data, columns, state, routing, commandbar } = useAdminState();
  const { view, query, endLoading } = routing;
  const router = useRouter();
  const previousView = usePrevious(view);

  React.useEffect(() => {
    endLoading();
    send({
      type: "UPDATE_DATA",
      data: {
        data: props.data,
      },
    });
  }, [props.data, endLoading, send]);

  React.useEffect(() => {
    if (previousView !== view) {
      send({
        type: "INIT_STATE",
        data: {
          router,
          config: clientConfig,
          modelSchema: props.modelSchema,
          query,
          data: props.data,
          view,
          serverConfig: props.configForClient,
          filters: props.filters,
        },
      });
    }
  }, [
    previousView,
    props.data,
    props.filters,
    props.configForClient,
    props.modelSchema,
    query,
    router,
    routing.endLoading,
    send,
    view,
  ]);

  return (
    <AdminLayout>
      <>
        <AdminLoadingOverlay />

        {!data.length && props.data.length ? (
          <></>
        ) : (
          <>
            <AdminFormSheet />
            <AdminCommandbar />

            <div className="hidden h-full flex-1 flex-col space-y-8 py-8 px-6 md:flex">
              <AdminPageHeader />

              <AdminTable />
            </div>
          </>
        )}
      </>
    </AdminLayout>
  );
};
