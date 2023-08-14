import { BasePageProps, ViewName } from "@/app/admin-utils/base-types";
import { Routing, redirectToView } from "@/app/admin-utils/routing";
import { generateModelSchema } from "@/app/admin-utils/utils.server";
import { clientConfig } from "@/app/config/index.client";
import { serverConfig } from "@/app/config/index.server";
import { pageLoader } from "./adapter";

const DEFAULT_VIEW: ViewName = "tag";

export const loader = async ({ searchParams, params }: BasePageProps) => {
  if (!searchParams?.view) {
    redirectToView(searchParams, DEFAULT_VIEW);
  }

  const query = Routing.create(searchParams).getQuery();

  const view = searchParams?.view;

  const config = Object.values(serverConfig).find(
    (config) => config.name === view
  );

  if (!config) {
    return redirectToView(searchParams, DEFAULT_VIEW);
  }

  const clientConfigModel = clientConfig[config.name];

  let data: any[] = [];

  if (config.crud.read.loader) {
    data = (await config.crud.read.loader({ searchParams, params, query }))
      .data;
  } else {
    data = await pageLoader({
      clientConfig: clientConfigModel,
      config,
      query,
    });
  }

  const modelSchema = generateModelSchema({ model: config.model });

  return {
    data,
    modelSchema,
  };
};
