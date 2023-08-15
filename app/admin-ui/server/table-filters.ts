import { PRODVIDER } from "..";
import {
  ConfigTypeClient,
  ConfigTypeServer,
  FilterOptionType,
  IDataValue,
  TableFilterProps,
} from "../client/admin-utils/base-types";
import { getPrismaModelSchema } from "./utils";

const { schema, client } = PRODVIDER.prisma;

export const getTableFilters = async ({
  clientConfig,
  serverConfig,
}: {
  clientConfig: ConfigTypeClient<any, string>;
  serverConfig: ConfigTypeServer<any, string>;
}) => {
  const model = serverConfig.model;
  const filtersPromises = clientConfig.table.filter.map(async (f) => {
    const filterName = f as string;

    const fieldDef = getPrismaModelSchema(
      schema,
      serverConfig.model
    )?.fields.find((f) => f.name === filterName);

    if (!fieldDef) throw new Error(`Field ${filterName} not found`);

    let vals: FilterOptionType[] = [];

    if (fieldDef.kind !== "object") {
      const labels = await (client?.[model as any] as any)?.findMany({
        select: {
          [fieldDef.name]: true,
        },
        take: 100,
      });

      vals = labels.map((l: any) => ({
        label: l[fieldDef.name],
        value: l[fieldDef.name],
      }));
    } else {
      const colors = (await (
        client[filterName.toLowerCase() as any] as any
      )?.findMany({
        take: 100,
      })) as IDataValue[] | undefined;

      vals =
        colors?.map((c) => ({
          label: (c as any)?.name || (c as any)?.label,
          value: c.id.toString(),
        })) || [];
    }

    const options: FilterOptionType[] =
      vals?.map((c) => ({
        label: (c as any)?.name || (c as any)?.label,
        value: c.value?.toString(),
      })) || [];

    return {
      options,
      accessorKey: filterName,
      title: filterName[0].toUpperCase() + filterName.slice(1),
    };
  });

  const filters: TableFilterProps = await Promise.all(filtersPromises);

  return filters;
};
