import { LL } from "@/lib/utils";
import { BasePageProps, ViewName } from "./admin-utils/base-types";
import { Routing } from "./admin-utils/routing";
import { redirectToView } from "./admin-utils/routing";
import { generateModelSchema } from "./admin-utils/utils.server";
import { serverConfig } from "./config/index.server";
import { AdminDashboard } from "./ui-implementations/admin-page";

const DEFAULT_VIEW: ViewName = "tag";

export const revalidate = 10; // revalidate at most every hour

export default async function Home({ searchParams, params }: BasePageProps) {
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

  const tasks = await config.data.loader({ searchParams, params, query });

  const modelSchema = generateModelSchema({ model: config.model });

  return <AdminDashboard data={tasks.data} modelSchema={modelSchema} />;
}
