import { ColumnDef } from "@tanstack/react-table";
import {
  ConfigTypeClient,
  ConfigTypeDictClient,
  FilterType,
  FormFieldType,
  IDataValue,
  ModelSchema,
  SidebarCategoryProps,
  ViewToggleOptionType,
} from "../admin-utils/base-types";

export interface AdminStateContextType {
  internal: {
    config: ConfigTypeDictClient<any>;
    data: IDataValue[];
    modelSchema: ModelSchema;
  };
  config: ConfigTypeClient<any>;
  columns: ColumnDef<any>[];
  data: IDataValue[];
  navigation: {
    categories: SidebarCategoryProps[];
  };
  control: {
    filters: {
      options: FilterType[];
    };
    viewToggle: {
      options: ViewToggleOptionType[];
    };
    search: {
      value: string;
      placeholder: string;
    };
  };
  form:
    | {
        title: string;
        description?: string;
        fields: FormFieldType[];
      }
    | undefined;

  state: {
    activeRow: IDataValue | undefined;
  };
}

export const DEFAULT_ADMIN_STATE_CONTEXT: AdminStateContextType = {
  internal: {
    data: [],
    config: {} as ConfigTypeDictClient<any>,
    modelSchema: {} as ModelSchema,
  },

  config: {} as ConfigTypeClient<any>,
  columns: [],
  data: [],
  navigation: {
    categories: [] as SidebarCategoryProps[],
  },
  control: {
    filters: {
      options: [],
    },
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
  },
  state: {
    activeRow: undefined,
  },
};
