import { Prisma } from "@prisma/client";
import {
  ConfigTypeClient,
  ConfigTypeDictClient,
  ConfigTypeDictServer,
  ConfigTypeServer,
  IDataValue,
} from "../client/admin-utils/base-types";

export const getConfigByView = (
  serverConfig: ConfigTypeDictServer,
  viewName: string
) => {
  const config = Object.values(serverConfig).find((c) => c.name == viewName);

  if (!config) throw new Error(`Config for view "${viewName}" not found`);

  return config;
};

export const getConfigByModel = (
  serverConfig: ConfigTypeDictServer,
  model: string
) => {
  const config = Object.values(serverConfig).find((c) => c.model == model);

  return config;
};

export const getPrismaModelSchema = (schema: typeof Prisma, model: string) => {
  return schema.dmmf.datamodel.models.find((prismaModel) => {
    return prismaModel.name.toLowerCase() === model.toLowerCase();
  });
};

export const createServerConfig = <T extends string | symbol | number>(
  configItems: ConfigTypeServer<any, T>[]
) => {
  return configItems.reduce((acc, config) => {
    return {
      ...acc,
      [config.name]: config,
    };
  }, {} as ConfigTypeDictServer);
};

export const createClientConfig = <T extends string | symbol | number>(
  configItems: ConfigTypeClient<any, T>[]
) => {
  return configItems.reduce((acc, config) => {
    return {
      ...acc,
      [config.name]: {
        ...config,
        model:
          (config.model as string)[0]?.toUpperCase() +
          (config.model as string).slice(1),
      },
    };
  }, {} as ConfigTypeDictClient);
};

export const createServerView = <T extends IDataValue, ModelName>(
  props: ConfigTypeServer<T, ModelName>
) => {
  return props;
};

export const createClientView = <T extends IDataValue, ModelName>(
  props: ConfigTypeClient<T, ModelName>
) => {
  return {
    ...props,
  };
};
