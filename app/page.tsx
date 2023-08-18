import { loader } from "@/app/admin-ui/server";
import { BasePageProps } from "./admin-ui/client/admin-utils/base-types";
import { AdminDashboard } from "./admin-ui/ui/admin-page";
import { clientConfig } from "./index.client";
import { serverConfig } from "./index.server";
import { waitAll, waitFor } from "@/lib/utils";

export default async function Home(props: BasePageProps) {
  const [{ data, modelSchema, filters }] = await waitAll([
    loader(props),
    waitFor(500),
  ]);

  return (
    <AdminDashboard filters={filters} data={data} modelSchema={modelSchema} />
  );
}
