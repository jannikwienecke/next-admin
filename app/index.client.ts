import { createClientConfig } from "./admin-ui/server/utils";
import tag from "./config/task/config.client";
import iStatus from "./config/istatus/config.client";
import iProject from "./config/iproject/config.client";
import { prisma } from "./db";

export const clientConfig = createClientConfig<keyof typeof prisma>([
  tag,
  iStatus,
  iProject,
]);
