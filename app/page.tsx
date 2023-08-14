import { loader } from "@/app/admin-ui/server";
import { BasePageProps } from "./admin-ui/client/admin-utils/base-types";
import { AdminDashboard } from "./admin-ui/ui/admin-page";

export default async function Home(props: BasePageProps) {
  const { data, modelSchema } = await loader(props);

  return <AdminDashboard data={data} modelSchema={modelSchema} />;
}
