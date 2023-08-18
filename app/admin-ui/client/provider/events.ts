import {
  ConfigTypeDictClient,
  IDataValue,
  ModelSchema,
  SortingProps,
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
      type: "UPDATE_DATA";
      data: {
        data: IDataValue[];
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
    }
  | {
      type: "CRUD_CLICK_CREATE_RELATIONAL_VALUE";
      data: {
        modelName: string;
        formState: Record<string, any>;
        value: string;
      };
    }
  | {
      type: "CLICK_SORTING";
      data: {
        sorting: SortingProps;
      };
    };
