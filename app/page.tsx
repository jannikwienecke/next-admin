import { loader } from "@/admin-ui/server";
import { BasePageProps } from "./admin-utils/base-types";
import { AdminDashboard } from "./ui-implementations/admin-page";

export const revalidate = 10; // revalidate at most every hour

export default async function Home(props: BasePageProps) {
  const { data, modelSchema } = await loader(props);

  return <AdminDashboard data={data} modelSchema={modelSchema} />;
}
