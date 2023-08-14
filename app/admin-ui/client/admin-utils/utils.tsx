import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CellContext, ColumnDef, HeaderContext } from "@tanstack/react-table";
import React from "react";
import { AdminTableColumnHeader } from "../../ui/admin-table-column-header";
import {
  ColumnSchema,
  ColumnTypeTest,
  ConfigTypeClient,
  ConfigTypeDictClient,
  FormFieldType,
  IDataValue,
  ModelSchema,
  SidebarCategoryProps,
} from "./base-types";
import { z } from "zod";

export const generateColumns = <T extends IDataValue>({
  customColumns,
  baseColumns,
  columnsToHide,
}: {
  customColumns: ColumnTypeTest<T>[];
  baseColumns: ColumnSchema[];
  columnsToHide: string[];
}): ColumnDef<T>[] => {
  // filter if is in custom columns -> not in base columns
  const baseColumnsTransformed = baseColumns
    .filter((baseColumn) => {
      return !customColumns.find(
        (customColumn) => customColumn.accessorKey === baseColumn.name
      );
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

  const allColumns = [...customColumns, ...baseColumnsTransformed]
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

  return [checkboxColumn as ColumnDef<T>, ...allColumns];
};

const RelationalFieldWrapper = ({
  row,
  baseColumns,
  column,
  children,
}: {
  baseColumns: ColumnSchema[];
  row: any;
  column: ColumnTypeTest<any>;
  children: React.ReactNode;
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
        alert(`Go to ${name} ${fieldId}`);
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
          label: y.model,
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

export const generateFormFields = ({
  modelSchema,
  config,
  activeRecord,
}: {
  modelSchema: ModelSchema;
  config: ConfigTypeClient<any, string>;
  activeRecord?: IDataValue;
}): FormFieldType[] => {
  const { fieldToHide } = config.form;

  const _fieldsToHide = (
    fieldToHide ? [...fieldToHide, "id"] : ["id"]
  ) as string[];
  return modelSchema.columns
    .filter((col) => !_fieldsToHide.includes(col.name))
    .map((col) => {
      const value = activeRecord?.[col.name];

      let type = col.type as FormFieldType["type"];
      let relation = undefined as FormFieldType["relation"];
      let name = col.name;
      let defaultValue = value || undefined;

      if (col.relationFromFields.length) {
        type = "Relation";
        relation = {
          fromField: col.relationFromFields[0],
          name: col.relationFromFields[0],
          modelName: col.name,
        };
        name = col.relationFromFields[0];

        defaultValue = {
          label: activeRecord?.[col.name],
          value: activeRecord?.[col.relationFromFields[0]],
        };
      }

      return {
        relation,
        name,
        value: undefined,
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

// export const generateZodSchema = ({
//   fields,
// }: {
//   fields: FormFieldType[];
// }): z.ZodSchema<any> => {
//   const dictTypeToZodTypeDict = {
//     String: z.string().min(2).max(50),
//     Int: z.number(),
//   };

//   return fields.reduce((acc, field) => {
//     const zodTypeFn = dictTypeToZodTypeDict[field.type];

//     // acc[field.name] = zodTypeFn;
//     // acc[field.name as any] = zodTypeFn;

//     return {
//       ...acc,
//       label: zodTypeFn,
//     };
//   }, z.object({}));
// };