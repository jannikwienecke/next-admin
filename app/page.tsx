import { loader } from "@/app/admin-ui/server";
import { BasePageProps } from "./admin-ui/client/admin-utils/base-types";
import { AdminDashboard } from "./admin-ui/ui/admin-page";
import { clientConfig } from "./index.client";
import { serverConfig } from "./index.server";

export default async function Home(props: BasePageProps) {
  const c = clientConfig;
  const s = serverConfig;

  const cNames = Object.keys(c);
  const sNames = Object.keys(s);

  sNames.forEach((name) => {
    if (!cNames.includes(name)) {
      const message = `Server config has a key that is not in client config: "${name}"`;

      throw new Error(message);
    }
  });

  const { data, modelSchema, filters } = await loader(props);

  return (
    <AdminDashboard filters={filters} data={data} modelSchema={modelSchema} />
  );
}
