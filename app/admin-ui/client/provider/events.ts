import {
  ConfigTypeDictClient,
  IDataValue,
  ModelSchema,
  TableFilterProps,
} from "../admin-utils/base-types";

export type AdminStateEvents =
  | {
      type: "INIT_STATE";
      data: {
        query: string;
        data: IDataValue[];
        config: ConfigTypeDictClient;
        modelSchema: ModelSchema;
        view: string;
        filters: TableFilterProps;
      };
    }
  | {
      type: "CRUD_CREATE";
    }
  | {
      type: "CRUD_EDIT";
      data: {
        row: IDataValue;
      };
    }
  | {
      type: "CRUD_DELETE";
      data: {
        row: IDataValue;
      };
    }
  | {
      type: "CRUD_CANCEL";
    }
  | {
      type: "CRUD_SAVE";
      data: {
        formState: Record<string, any>;
      };
    };
