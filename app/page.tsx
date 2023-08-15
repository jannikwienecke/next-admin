import { loader } from "@/app/admin-ui/server";
import { BasePageProps } from "./admin-ui/client/admin-utils/base-types";
import { AdminDashboard } from "./admin-ui/ui/admin-page";

export default async function Home(props: BasePageProps) {
  const { data, modelSchema, filters } = await loader(props);

  return (
    <AdminDashboard filters={filters} data={data} modelSchema={modelSchema} />
  );
}
