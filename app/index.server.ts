import { createServerConfig } from "./admin-ui/server/utils";
import color from "./config/color/config.server";
import tag from "./config/tag/config.server";
import { prisma } from "./db";

export const serverConfig = createServerConfig<keyof typeof prisma>([
  tag,
  color,
]);
