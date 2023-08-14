import { ConfigTypeDictServer } from "../admin-ui/client/admin-utils/base-types";
import { serverConfig as tagConfigServer } from "./tag/config.server";

const configList = [tagConfigServer];

export const serverConfig: ConfigTypeDictServer = configList.reduce(
  (acc, config) => {
    return {
      ...acc,
      [config.name]: config,
    };
  },
  {} as ConfigTypeDictServer
);
