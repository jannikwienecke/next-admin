import { ConfigTypeDictServer } from "../client/admin-utils/base-types";

export const getConfigByView = (
  serverConfig: ConfigTypeDictServer,
  viewName: string
) => {
  const config = Object.values(serverConfig).find((c) => c.name == viewName);

  if (!config) throw new Error(`Config for view "${viewName}" not found`);

  return config;
};
