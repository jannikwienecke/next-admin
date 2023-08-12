import { ColumnDef } from "@tanstack/react-table";
import {
  ConfigTypeClient,
  ConfigTypeDictClient,
  FilterType,
  IDataValue,
  SidebarCategoryProps,
  ViewToggleOptionType,
} from "../admin-utils/base-types";

export interface AdminStateContextType {
  internal: {
    config: ConfigTypeDictClient<any>;
    data: IDataValue[];
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
}

export const DEFAULT_ADMIN_STATE_CONTEXT: AdminStateContextType = {
  internal: {
    data: [],
    config: {} as ConfigTypeDictClient<any>,
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
};
