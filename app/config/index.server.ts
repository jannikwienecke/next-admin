import {
  ConfigTypeDictServer,
  ModelType,
  ViewName,
} from "../admin-utils/base-types";
import { serverConfig as tagConfigServer } from "./tasks/config.server";

const configList = [tagConfigServer];

export const serverConfig: ConfigTypeDictServer<ViewName> = configList.reduce(
  (acc, config) => {
    return {
      ...acc,
      [config.name]: config,
    };
  },
  {} as ConfigTypeDictServer<ViewName>
);
