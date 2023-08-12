import {
  ConfigTypeDictClient,
  IDataValue,
  ModelSchema,
  ViewName,
} from "../admin-utils/base-types";

export type AdminStateEvents =
  | {
      type: "INIT_STATE";
      data: {
        query: string;
        data: IDataValue[];
        config: ConfigTypeDictClient<any>;
        modelSchema: ModelSchema;
        view: ViewName;
      };
    }
  | {
      type: "SEARCH_CHANGED";
      data: {
        value: string;
      };
    };
