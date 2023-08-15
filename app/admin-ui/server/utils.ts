import { Prisma } from "@prisma/client";
import { ConfigTypeDictServer } from "../client/admin-utils/base-types";

export const getConfigByView = (
  serverConfig: ConfigTypeDictServer,
  viewName: string
) => {
  const config = Object.values(serverConfig).find((c) => c.name == viewName);

  if (!config) throw new Error(`Config for view "${viewName}" not found`);

  return config;
};

export const getPrismaModelSchema = (schema: typeof Prisma, model: string) => {
  return schema.dmmf.datamodel.models.find((prismaModel) => {
    return prismaModel.name.toLowerCase() === model.toLowerCase();
  });
};
