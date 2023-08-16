import { createClientConfig } from "./admin-ui/server/utils";
import tag from "./config/tag/config.client";
import color from "./config/color/config.client";
import { prisma } from "./db";

export const clientConfig = createClientConfig<keyof typeof prisma>([
  tag,
  color,
]);
