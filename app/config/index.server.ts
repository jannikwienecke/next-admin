import { ConfigTypeDictServer, ModelType } from "../admin-utils/base-types";
import { serverConfig as tagConfigServer } from "./tasks/config.server";

const configList = [tagConfigServer];

export const serverConfig: ConfigTypeDictServer<ModelType> = configList.reduce(
  (acc, config) => {
    return {
      ...acc,
      [config.name]: config,
    };
  },
  {} as ConfigTypeDictServer<ModelType>
);
