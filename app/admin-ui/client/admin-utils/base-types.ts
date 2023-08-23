export type IDataValue<T = Record<string, any>> = {
  id: number | string;
} & {
  [key: string]: any;
} & T;

export type Dict = {
  [key: string]:
    | string
    | number
    | boolean
    | undefined
    | null
    | Date
    | {
        label: string;
        color: string;
      }[];
} & {
  id: string | number;
};

export interface ColumnTypeTest<T extends IDataValue> {
  // title shown in the header
  title: string;
  // key used to access the value in the row
  accessorKey: keyof T;
  // optional icon for the row
  icon?: React.ComponentType<React.ComponentProps<"svg">>;
  // cell renderer
  cell?: (context: T) => React.ReactNode;
  // should is be sortable
  canSort?: boolean;
  // should it be possible to hide the column
  canHide?: boolean;
  // priority of the column
  priority?: number;
}

export type CellComponent<T extends IDataValue> = (
  context: T
) => React.ReactNode;

export type FilterOptionType = {
  label: string;
  value: string;
  icon?: React.ComponentType<any>;
};

export type FilterType = {
  title: string;
  accessorKey: string;
  options: FilterOptionType[];
};

export type ViewToggleOptionType = {
  id: string | number;
  label: string;
  isChecked: boolean;
};

export type LoaderProps = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export type LoaderFunctionType<T> = (
  props: LoaderProps & {
    query: string;
    sorting: SortingProps;
  }
) => Promise<{
  data: T[];
}>;

export type SearchParamsKeys = "view" | "query" | "orderBy" | "orderByField";

export type BasePageProps = {
  params: { slug: string };
  searchParams: Record<string, string>;
};

export interface ConfigType<T extends IDataValue> {
  model: string;
  data: {
    loader: LoaderFunctionType<T>;
  };
  table: {
    columns: ColumnTypeTest<T>[];
  };
}

export type MappingType<T = any> = {
  dateCreated?: keyof T;
  dateUpdated?: keyof T;
  grouping?: keyof T;
  tags?: keyof T;
};

export interface ConfigTypeServer<T extends IDataValue, ModelName> {
  model: ModelName;
  name: string;

  crud: {
    read: {
      loader?: LoaderFunctionType<T>;
      orderBy?: Partial<{
        [key in keyof T]?: "asc" | "desc";
      }>;
      labelKey: keyof T;
      relationalFields?: Partial<{
        [key in keyof T]: {
          labelKey: string;
        };
      }>;
      mappings?: MappingType<T>;
    };
  };
  // // key used to display the date item
  // labelKey: keyof T;
}

export type ParentName = "All" | "App";

export interface ConfigTypeClient<T extends IDataValue, ModelName> {
  model: ModelName;
  name: string;
  label: string;
  baseView?: string;
  labelKey: keyof T;
  table: {
    columns: ColumnTypeTest<T>[];
    columnsToHide?: (keyof T)[];
    filter: (keyof T)[];
  };
  form: {
    // fields:
    fieldToHide?: (keyof T)[];
  };
  navigation: {
    parent: ParentName;
    icon: React.ComponentType<any>;
  };
}

export type ConfigTypeDictServer = {
  string: ConfigTypeServer<any, string>;
};

export type ConfigTypeDictClient = {
  string: ConfigTypeClient<any, string>;
};

export interface ColumnSchema {
  name: string;
  kind: string;
  isRequired: boolean;
  isUnique: boolean;
  isId: boolean;
  type: string;
  relationFromFields: string[];
  isList: boolean;
  hasDefaultValue: boolean;
}

export type ModelSchema = {
  [model: string]: {
    columns: ColumnSchema[];
  };
};

export interface SidebarItemProps {
  label: string;
  active?: boolean;
  icon: React.ComponentType<any>;
  name: string;
  onClick: () => void;
}

export interface SidebarCategoryProps {
  label: string;
  items: SidebarItemProps[];
}

export type FormFieldType = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  value: unknown;
  defaultValue: string;
  placeholder?: string;
  type: "Int" | "String" | "Relation";
  relation?: {
    name: string;
    fromField: string;
    modelName: string;
  };
  // schema: ZodSchema<any>;
};

export interface ComboboxItemProps {
  value: number;
  label: string;
}

export type TableFilterProps = FilterType[];

export type SortingProps = {
  id: string;
  direction: "asc" | "desc";
};

export type RelationalFieldClickHandlerProps = {
  col: ColumnTypeTest<any>;
  row: IDataValue;
  name: string;
};

export type ICommandType = "NAVIGATION" | "STATE_ACTION" | "SERVER_ACTION";

export type ICommandAction = {
  type: "NAVIGATION";
  to: {
    view: string;
  };
};

export type ICommand = {
  action: ICommandAction;
  label: string;
  icon?: React.ComponentType<any>;
};

// Go To Projects
// Go To Tasks
// what we have is a action that is a navigation with the
// label go to projects and the icon defined in the navigation
//

export type MetaDataType = {
  dateCreated: string;
  dateUpdated: string;
  lastUpdatedBy: string;
};

export type ClientConfigServer = {
  mappings?: MappingType<any>;
};

export type FormStateViewDictType = {
  string: Record<string, any>;
};
