import { ConfigTypeDictClient, ModelType } from "../admin-utils/base-types";
import { clientConfig as tagConfig } from "./tasks/config.client";

const configList = [tagConfig];

export const clientConfig: ConfigTypeDictClient<ModelType> = configList.reduce(
  (acc, config) => {
    return {
      ...acc,
      [config.name]: config,
    };
  },
  {} as ConfigTypeDictClient<ModelType>
);
