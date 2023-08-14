import { ConfigTypeDictClient } from "../admin-ui/client/admin-utils/base-types";
import { clientConfig as tagConfig } from "./tag/config.client";

const configList = [tagConfig];

export const clientConfig: ConfigTypeDictClient = configList.reduce(
  (acc, config) => {
    return {
      ...acc,
      [config.name]: {
        ...config,
      },
    };
  },
  {} as ConfigTypeDictClient
);
