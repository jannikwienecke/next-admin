import {
  BasePageProps,
  ClientConfigServer,
} from "@/app/admin-ui/client/admin-utils/base-types";
import {
  Routing,
  redirectToView,
} from "@/app/admin-ui/client/admin-utils/routing";
import { generateModelSchema } from "@/app/admin-ui/client/admin-utils/utils.server";
import { pageLoader } from "./adapter";
import { getTableFilters } from "./table-filters";
import { serverConfig } from "@/app/index.server";
import { clientConfig } from "@/app/index.client";

const _validateConfig = () => {
  const clientNames = Object.keys(clientConfig);
  const serverNames = Object.keys(serverConfig);

  serverNames.forEach((name) => {
    if (!clientNames.includes(name)) {
      const message = `Server config has a key that is not in client config: "${name}"`;

      throw new Error(message);
    }
  });
};

export const loader = async ({ searchParams, params }: BasePageProps) => {
  _validateConfig();

  const defaultConfig = Object.values(serverConfig)[0];
  const defaultView = defaultConfig.name;

  if (!searchParams?.view) {
    redirectToView(searchParams, defaultView);
  }

  const query = Routing.create(searchParams).getQuery();
  const sorting = Routing.create(searchParams).getSorting();
  const view = searchParams?.view;

  const config = Object.values(serverConfig).find(
    (config) => config.name.toLowerCase() === view.toLowerCase()
  );

  if (!config) {
    return redirectToView(searchParams, defaultView);
  }

  const clientConfigModel =
    clientConfig[config.name as keyof typeof clientConfig];

  let data: any[] = [];

  if (config.crud.read.loader) {
    data = (
      await config.crud.read.loader({ searchParams, params, query, sorting })
    ).data;
  } else {
    data = await pageLoader({
      clientConfig: clientConfigModel,
      config,
      query,
      sorting,
    });
  }

  const modelSchema = generateModelSchema({ model: config.model });

  const filters = await getTableFilters({
    clientConfig: clientConfigModel,
    serverConfig: config,
  });

  const configForClient: ClientConfigServer = {
    mappings: config.crud.read.mappings,
  };

  return {
    data,
    modelSchema,
    filters,
    configForClient,
  };
};
