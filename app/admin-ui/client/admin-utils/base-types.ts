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
  }
) => Promise<{
  data: T[];
}>;

export type SearchParamsKeys = "view" | "query";

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

export interface ConfigTypeServer<
  T extends IDataValue,
  ModelName extends string | symbol
> {
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
    };
  };
  // // key used to display the date item
  // labelKey: keyof T;
}

export type ParentName = "All" | "App";

export interface ConfigTypeClient<T extends IDataValue, ModelName> {
  model: ModelName;
  name: string;
  baseView?: string;
  table: {
    columns: ColumnTypeTest<T>[];
    columnsToHide?: (keyof T)[];
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
}

export type ModelSchema = {
  columns: ColumnSchema[];
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