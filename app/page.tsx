import { BasePageProps, ViewName } from "./admin-utils/base-types";
import { redirectToView } from "./admin-utils/routing";
import { generateModelSchema } from "./admin-utils/utils.server";
import { serverConfig } from "./config/index.server";
import { AdminTable } from "./ui-implementations/admin-page";

const DEFAULT_VIEW: ViewName = "tag";

export default async function Home({ searchParams, params }: BasePageProps) {
  if (!searchParams?.view) {
    redirectToView(searchParams, DEFAULT_VIEW);
  }

  const view = searchParams?.view;
  const config = Object.values(serverConfig).find(
    (config) => config.name === view
  );

  if (!config) {
    return redirectToView(searchParams, DEFAULT_VIEW);
  }

  const tasks = await config.data.loader({ searchParams, params });

  const modelSchema = generateModelSchema({ model: config.model });

  return <AdminTable data={tasks.data} modelSchema={modelSchema} />;
}
