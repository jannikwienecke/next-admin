import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CellContext, ColumnDef, HeaderContext } from "@tanstack/react-table";
import React from "react";
import { AdminTableColumnHeader } from "../../ui/admin-table-column-header";
import { AdminStateContextType } from "../provider/state-context";
import {
  ClientConfigServer,
  ColumnSchema,
  ColumnTypeTest,
  ConfigTypeClient,
  ConfigTypeDictClient,
  FormFieldType,
  FormStateViewDictType,
  ICommand,
  IDataValue,
  MetaDataType,
  ModelSchema,
  RelationalFieldClickHandlerProps,
  SidebarCategoryProps,
  StateOfForm,
  StateOfFormDictType,
} from "./base-types";

export const generateColumns = <T extends IDataValue>({
  customColumns,
  baseColumns,
  columnsToHide,
  onClickRelationalField,
}: {
  customColumns: ColumnTypeTest<T>[];
  baseColumns: ColumnSchema[];
  columnsToHide: string[];
  onClickRelationalField: (options: RelationalFieldClickHandlerProps) => void;
}): ColumnDef<T>[] => {
  const baseColumnRelationFields = baseColumns
    .map((c) => c.relationFromFields?.[0])
    .filter(Boolean)
    .flat();

  // filter if is in custom columns -> not in base columns
  const baseColumnsTransformed = baseColumns
    .filter((baseColumn) => {
      if (baseColumnRelationFields.includes(baseColumn.name)) {
        return false;
      }
      if (baseColumn.isList === true) {
        return false;
      }
      if (baseColumn.hasDefaultValue === true) {
        return false;
      }

      if (
        customColumns.find(
          (customColumn) => customColumn.accessorKey === baseColumn.name
        )
      ) {
        return false;
      }
      return true;
    })
    .map((columnSchema) => {
      const columnType: ColumnTypeTest<T> = {
        accessorKey: columnSchema.name,
        title:
          columnSchema.name.charAt(0).toUpperCase() +
          columnSchema.name.slice(1),
        canHide: true,
        canSort: true,
      };
      return columnType;
    });

  const allColumns: ColumnDef<any>[] = [
    ...customColumns,
    ...baseColumnsTransformed,
  ]
    .filter((column) => !columnsToHide.includes(column.accessorKey as string))

    // sort by priority
    //  lowest number -> should be at the end of the array
    // highest number -> should be at the beginning of the array
    // if no priority -> should be at the beginning of the array
    .sort((a, b) => {
      if (a.priority === undefined && b.priority === undefined) return 0;
      if (a.priority === undefined) return -1;
      if (b.priority === undefined) return 1;

      return a.priority - b.priority;
    })
    .map((columnConfig) => {
      return {
        accessorKey: columnConfig.accessorKey,

        filterFn: (row, id, filterValue) => {
          const col = baseColumns.find((c) => c.name === id);

          if (!col) throw new Error("Column not found");
          if (col?.kind !== "object") {
            const value = row.original[id];

            return filterValue
              .map((f: any) => f?.toString()?.toLowerCase())
              .includes(value?.toString()?.toLowerCase());
          } else {
            const relationFromField = col?.relationFromFields?.[0];

            if (!relationFromField) throw new Error("Relation not found");

            const value = row.original[relationFromField];

            return filterValue.includes(value?.toString()?.toLowerCase());
          }
        },
        header: ({ column }: HeaderContext<any, any>) => (
          <AdminTableColumnHeader
            sorted={column.getIsSorted()}
            onSort={(direction) =>
              column.toggleSorting(direction === "asc" ? false : true)
            }
            canSort={columnConfig.canSort}
            onHide={
              columnConfig.canHide
                ? () => column.toggleVisibility(false)
                : undefined
            }
            title={columnConfig.title}
          />
        ),
        cell: columnConfig.cell
          ? ({ row }: CellContext<any, any>) => {
              return (
                <RelationalFieldWrapper
                  onClick={() =>
                    onClickRelationalField({
                      col: columnConfig,
                      row: row.original,
                      name: columnConfig.accessorKey as string,
                    })
                  }
                  column={columnConfig}
                  row={row}
                  baseColumns={baseColumns}
                >
                  {columnConfig.cell?.(row.original)}
                </RelationalFieldWrapper>
              );
            }
          : ({ row }: CellContext<any, any>) => {
              const value = row.getValue(columnConfig.accessorKey as string) as
                | string
                | undefined
                | null;

              if (!value) return null;

              return (
                <RelationalFieldWrapper
                  onClick={() =>
                    onClickRelationalField({
                      col: columnConfig,
                      row: row.original,
                      name: columnConfig.accessorKey as string,
                    })
                  }
                  column={columnConfig}
                  row={row}
                  baseColumns={baseColumns}
                >
                  <div className={cn("flex items-center")}>
                    {columnConfig?.icon && (
                      <columnConfig.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{value}</span>
                  </div>
                </RelationalFieldWrapper>
              );
            },
      };
    });

  return [checkboxColumn as ColumnDef<T>, ...(allColumns as ColumnDef<T>[])];
};

const RelationalFieldWrapper = ({
  row,
  baseColumns,
  column,
  children,
  onClick,
}: {
  baseColumns: ColumnSchema[];
  row: any;
  column: ColumnTypeTest<any>;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  const baseColumn = baseColumns.find((c) => c.name === column.accessorKey);

  const { relationFromFields, name } = baseColumn || {};
  const relationFromField = relationFromFields?.[0];
  const fieldId = relationFromField
    ? row.original[relationFromField]
    : undefined;

  if (!fieldId) return <>{children}</>;

  return (
    <div
      onClick={() => {
        onClick();
      }}
      className="cursor-pointer hover:underline"
    >
      {children}
    </div>
  );
};

const checkboxColumn: ColumnDef<any> = {
  id: "select",
  accessorKey: "",
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      className="translate-y-[2px]"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      className="translate-y-[2px]"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};

export const generateNavigationCategories = ({
  config,
}: {
  config: ConfigTypeDictClient;
}): SidebarCategoryProps[] => {
  const parents = Object.entries(config).map(([x, y]) => {
    return y.navigation.parent;
  });

  const uniqueParents = Array.from(new Set(parents));

  return uniqueParents.map((parent): SidebarCategoryProps => {
    const allItemsOfParent = Object.entries(config).filter(([x, y]) => {
      return y.navigation.parent === parent;
    });

    return {
      label: parent,
      items: allItemsOfParent.map(([x, y]) => {
        return {
          icon: y.navigation.icon,
          label: y.label,
          active: false,
          name: y.name,
          onClick: () => {
            throw new Error(
              "generateNavigationCategories: Must be overritten. Not implemented"
            );
          },
        };
      }),
    };
  });
};

// const formSchema = z.object({
//   username: z.string().min(2).max(50),
// });

export const generateFields = ({
  modelSchema: moderlSchamDict,
  config,
  activeRecord,
  defaultValueLabelKey,
  defaultFormState,
  stateOfFormDict,
}: {
  modelSchema: ModelSchema;
  config: ConfigTypeClient<any, string>;
  activeRecord?: IDataValue;
  defaultValueLabelKey?: string;
  defaultFormState?: Record<string, any>;
  stateOfFormDict?: StateOfFormDictType;
}): FormFieldType[] => {
  const { fieldToHide } = config.form;

  const modelSchema = moderlSchamDict[config.model];
  const stateOfForm =
    stateOfFormDict?.[config.name as keyof typeof stateOfFormDict];

  const baseColumnRelationFields = modelSchema.columns
    .map((c) => c.relationFromFields?.[0])
    .filter(Boolean)
    .flat() as string[];

  const _fieldsToHide = (
    fieldToHide ? [...fieldToHide, "id"] : ["id"]
  ) as string[];

  return modelSchema.columns
    .filter((col) => !_fieldsToHide.includes(col.name))
    .filter((col) => !baseColumnRelationFields.includes(col.name))
    .filter((col) => col.isList === false)
    .filter((col) => col.hasDefaultValue === false)
    .map((col) => {
      const value = activeRecord?.[col.name];

      let type = col.type as FormFieldType["type"];
      let relation = undefined as FormFieldType["relation"];
      let name = col.name;

      const defaultFormStateValue =
        defaultFormState && defaultFormState[col.name];

      let defaultValue = defaultFormStateValue
        ? defaultFormStateValue
        : config.labelKey === col.name
        ? defaultValueLabelKey || value
        : value || undefined;

      if (col.relationFromFields.length) {
        type = "Relation";
        relation = {
          fromField: col.relationFromFields[0],
          name: col.relationFromFields[0],
          modelName: col.name,
        };
        // name = col.relationFromFields[0];

        if (activeRecord) {
          defaultValue = {
            label: activeRecord?.[col.name],
            value: activeRecord?.[col.relationFromFields[0]],
          };
        }
      }

      return {
        error:
          stateOfForm?.showMissingValues &&
          stateOfForm?.missingFields?.includes(col.name)
            ? `Field ${col.name} is required`
            : undefined,
        relation,
        name,
        value: defaultValue,
        defaultValue,
        required: col.isRequired,
        type,

        label: `${col.name.charAt(0).toUpperCase() + col.name.slice(1)}`,
        placeholder: `Enter ${
          col.name.charAt(0).toUpperCase() + col.name.slice(1)
        }`,
      };
    });
};

export const generateCommandbar = () => {
  return {};
};

export const getLabelValue = ({
  config,
  activeRecord,
}: {
  config: ConfigTypeClient<any, string>;
  activeRecord: IDataValue;
}) => {
  const labelKey = config.labelKey || "name" || "title" || "label";
  const value = activeRecord?.[labelKey as string];

  if (!value) throw new Error(`No Labelkey found: ${labelKey as string}`);

  return value;
};

export const getMetaData = ({
  config,
  activeRecord,
}: {
  config: ClientConfigServer;
  activeRecord: IDataValue;
}): MetaDataType => {
  const { dateCreated, dateUpdated } = config.mappings || {};

  return {
    dateCreated: activeRecord[dateCreated as string],
    dateUpdated: activeRecord[dateUpdated as string],
    lastUpdatedBy: "",
  };
};

export const generateCommandbarActions = ({
  config,
}: {
  config: ConfigTypeDictClient;
}): AdminStateContextType["commandbar"]["view"]["commands"] => {
  const navigationActions: ICommand[] = Object.values(config).map((c) => {
    return {
      action: {
        type: "NAVIGATION",
        to: {
          view: c.name,
        },
      },
      label: c.label,
      icon: c.navigation.icon,
    };
  });

  return {
    actions: [],
    suggestions: [...navigationActions],
  };
};

export const generateCommandSearchView = ({
  config,
  viewName,
}: {
  config: ConfigTypeDictClient;
  viewName: string;
}): AdminStateContextType["commandbar"]["view"]["search"] => {
  const activeConfig = config[viewName as keyof ConfigTypeDictClient];

  return {
    view: "full",
  };
};

export const getRequiredFields = ({
  config,
  modelSchema,
}: {
  config: ConfigTypeClient<any, string>;
  modelSchema: ModelSchema;
}) => {
  const moderlSchamDict = modelSchema[config.model];

  const columns = moderlSchamDict.columns;
  const relationalIdFields = columns.map((c) => c.relationFromFields).flat();

  const requiredColumns = columns.filter(
    (c) =>
      c.isRequired &&
      !c.isList &&
      !c.hasDefaultValue &&
      !relationalIdFields.includes(c.name)
  );

  return requiredColumns;
};

export const getMissingFieldsInForm = ({
  config,
  modelSchema,
  formStateDict,
}: {
  config: ConfigTypeClient<any, string>;
  modelSchema: ModelSchema;
  formStateDict: FormStateViewDictType;
}) => {
  const requiredFields = getRequiredFields({ config, modelSchema });

  const missingFields = requiredFields.filter((f) => {
    return !formStateDict?.[config.name as keyof typeof formStateDict]?.[
      f.name
    ];
  });

  return missingFields.length ? missingFields : undefined;
};

export const getActiveConfig = ({
  context,
}: {
  context: AdminStateContextType;
}) => {
  const relationalConfig = context.form?.activeRelationalConfigs?.[0];
  const config = relationalConfig || context.config;

  return config;
};

export const getFormStateOfView = ({
  context,
}: {
  context: AdminStateContextType;
}): FormStateViewDictType["string"] => {
  const config = getActiveConfig({ context });
  const form = context.form;
  const viewName = config.name;

  const formState = form?.states?.[viewName as keyof typeof form.states];

  if (!formState) return {} as FormStateViewDictType;

  return formState;
};

export const updateFormStateDict = ({
  context,
  fieldName,
  value,
}: {
  context: AdminStateContextType;
  fieldName: string;
  value: any;
}): FormStateViewDictType => {
  const formStateDict = context.form?.states || ({} as FormStateViewDictType);
  const viewName = getActiveConfig({ context }).name;
  const formStateOfView = getFormStateOfView({ context });

  return {
    ...formStateDict,
    [viewName]: {
      ...formStateOfView,
      [fieldName]: value,
    },
  };
};

export const resetFormStateDict = ({
  context,
}: {
  context: AdminStateContextType;
}): FormStateViewDictType => {
  const formStateDict = context.form?.states || ({} as FormStateViewDictType);
  const activeViewName = getActiveConfig({ context }).name;

  return {
    ...formStateDict,
    [activeViewName]: {},
  };
};

export const resetStateOfForms = ({
  context,
}: {
  context: AdminStateContextType;
}): StateOfFormDictType => {
  const config = getActiveConfig({ context });
  const states = context.form?.stateOfForms || ({} as StateOfFormDictType);

  return {
    ...states,
    [config.name]: {
      isDirty: false,
      showMissingValues: false,
      isReady: false,
      missingFields: undefined,
    },
  };
};

export const updateStateOfForms = ({
  context,
  newStateOfForm,
}: {
  context: AdminStateContextType;
  newStateOfForm: Partial<StateOfForm>;
}): StateOfFormDictType => {
  const config = getActiveConfig({ context });
  const states = context.form?.stateOfForms || ({} as StateOfFormDictType);
  const stateOfCurrentForm = states[config.name as keyof typeof states] || {};

  return {
    ...states,
    [config.name]: {
      ...stateOfCurrentForm,
      ...newStateOfForm,
    },
  };
};
