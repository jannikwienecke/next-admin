import { ColumnDef } from "@tanstack/react-table";
import {
  ClientConfigServer,
  ConfigTypeClient,
  ConfigTypeDictClient,
  FilterType,
  FormFieldType,
  FormStateViewDictType,
  ICommand,
  ICommandAction,
  IDataValue,
  MetaDataType,
  ModelSchema,
  SidebarCategoryProps,
  StateOfFormDictType,
  TableFilterProps,
  ViewToggleOptionType,
} from "../admin-utils/base-types";
import { z } from "zod";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

export interface AdminStateContextType {
  internal: {
    config: ConfigTypeDictClient;
    data: IDataValue[] | undefined;
    modelSchema: ModelSchema;
    router: AppRouterInstance;
    clientConfigServer: ClientConfigServer;
  };
  config: ConfigTypeClient<any, string>;
  columns: ColumnDef<any>[];
  data: IDataValue[];
  navigation: {
    categories: SidebarCategoryProps[];
  };
  control: {
    filters: TableFilterProps;
    viewToggle: {
      options: ViewToggleOptionType[];
    };
    search: {
      value: string;
      placeholder: string;
    };
  };
  commandbar: {
    view: {
      detail?: {
        type: "detail";
        view: string;
        activeItem: IDataValue;
        fields: FormFieldType[];
        label: string;
        meta: MetaDataType;
      };
      commands?: {
        actions: ICommand[];
        suggestions?: ICommand[];
      };
      search?: {
        view: "split" | "full";
        // activeConfig: ConfigTypeClient<any, string>;
      };
    };
  };

  form: {
    title?: string;
    description?: string;
    fields?: FormFieldType[];
    schema?: Record<string, z.ZodType<any, any, any>>;
    activeRelationalConfigs?: ConfigTypeClient<any, string>[];
    states?: FormStateViewDictType;
    stateOfForms?: StateOfFormDictType;
    error?:
      | {
          message: string;
        }
      | undefined;
  };

  state: {
    activeRow: IDataValue | undefined;
    activeAction: "create" | "edit" | undefined;
    commandbar: {
      showCommands: boolean;
      activeConfig?: ConfigTypeClient<any, string>;
      error?:
        | {
            message: string;
          }
        | undefined;
    };
  };
}

export const DEFAULT_ADMIN_STATE_CONTEXT: AdminStateContextType = {
  internal: {
    data: undefined,
    config: {} as ConfigTypeDictClient,
    modelSchema: {} as ModelSchema,
    router: {} as AppRouterInstance,
    clientConfigServer: {} as ClientConfigServer,
  },

  config: {} as ConfigTypeClient<any, string>,
  columns: [],
  data: [],
  navigation: {
    categories: [] as SidebarCategoryProps[],
  },
  commandbar: {
    view: {},
  },

  control: {
    filters: [],
    viewToggle: {
      options: [],
    },
    search: {
      value: "",
      placeholder: "Search...",
    },
  },
  form: {
    title: "",
    description: "",
    fields: [],
    error: undefined,
    states: undefined,
    stateOfForms: undefined,
  },
  state: {
    activeRow: undefined,
    activeAction: undefined,
    commandbar: {
      showCommands: false,
      activeConfig: undefined,
      error: undefined,
    },
  },
};
