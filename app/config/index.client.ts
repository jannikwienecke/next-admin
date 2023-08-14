import {
  ConfigTypeDictClient,
  ModelType,
  ViewName,
} from "../admin-utils/base-types";
import { clientConfig as tagConfig } from "./tasks/config.client";

const configList = [tagConfig];

export const clientConfig: ConfigTypeDictClient<ViewName> = configList.reduce(
  (acc, config) => {
    return {
      ...acc,
      [config.name]: config,
    };
  },
  {} as ConfigTypeDictClient<ViewName>
);
