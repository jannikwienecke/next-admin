import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import {
  ClientConfigServer,
  ConfigTypeDictClient,
  ICommand,
  IDataValue,
  ModelSchema,
  SortingProps,
  TableFilterProps,
} from "../admin-utils/base-types";

export type AdminStateEvents =
  | {
      type: "TEST";
    }
  | {
      type: "INIT_STATE";
      data: {
        query: string;
        data: IDataValue[];
        config: ConfigTypeDictClient;
        modelSchema: ModelSchema;
        view: string;
        filters: TableFilterProps;
        router: AppRouterInstance;
        serverConfig: ClientConfigServer;
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
    }
  | {
      type: "CLICK_ON_RELATIONAL_FIELD";
      data: {
        row: IDataValue;
        name: string;
      };
    }
  | {
      type: "CLICK_OPEN_COMMAND_BAR";
    }
  | {
      type: "CLICK_CLOSE_COMMAND_BAR";
    }
  | {
      type: "CLICK_CLOSE_COMMANDS";
    }
  | {
      type: "CLICK_ENTER_KEY_COMMAND_BAR";
    }
  | {
      type: "COMMAND_BAR_ACTION_FIRED";
      data: {
        action: ICommand;
      };
    }
  | {
      type: "COMMAND_BAR_SELECT_ROW";
      data: {
        row: IDataValue;
      };
    };
