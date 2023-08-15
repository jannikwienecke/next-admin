import { ColumnDef } from "@tanstack/react-table";
import {
  ConfigTypeClient,
  ConfigTypeDictClient,
  FilterType,
  FormFieldType,
  IDataValue,
  ModelSchema,
  SidebarCategoryProps,
  TableFilterProps,
  ViewToggleOptionType,
} from "../admin-utils/base-types";
import { z } from "zod";

export interface AdminStateContextType {
  internal: {
    config: ConfigTypeDictClient;
    data: IDataValue[];
    modelSchema: ModelSchema;
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
  form?: {
    title?: string;
    description?: string;
    fields?: FormFieldType[];
    schema?: Record<string, z.ZodType<any, any, any>>;
    // state?: Record<string, any>;
    error?:
      | {
          message: string;
        }
      | undefined;
  };

  state: {
    activeRow: IDataValue | undefined;
    activeAction: "create" | "edit" | undefined;
  };
}

export const DEFAULT_ADMIN_STATE_CONTEXT: AdminStateContextType = {
  internal: {
    data: [],
    config: {} as ConfigTypeDictClient,
    modelSchema: {} as ModelSchema,
  },

  config: {} as ConfigTypeClient<any, string>,
  columns: [],
  data: [],
  navigation: {
    categories: [] as SidebarCategoryProps[],
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
  },
  state: {
    activeRow: undefined,
    activeAction: undefined,
  },
};
