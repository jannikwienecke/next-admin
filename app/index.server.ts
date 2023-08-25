import { createServerConfig } from "./admin-ui/server/utils";
import tag from "./config/task/config.server";
import iStatus from "./config/istatus/config.server";
import iProject from "./config/iproject/config.server";
import { prisma } from "./db";

export const serverConfig = createServerConfig<keyof typeof prisma>([
  tag,
  iStatus,
  iProject,
]);
