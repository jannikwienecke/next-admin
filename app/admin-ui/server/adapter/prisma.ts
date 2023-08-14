import { PRODVIDER } from "@/app/admin-ui";
import {
  ConfigTypeClient,
  ConfigTypeServer,
} from "@/app/admin-ui/client/admin-utils/base-types";

const { client, schema } = PRODVIDER.prisma;

const getFieldsToInclude = ({
  config,
  clientConfig,
}: {
  config: ConfigTypeServer<any, string>;
  clientConfig: ConfigTypeClient<any, string>;
}) => {
  const { columnsToHide } = clientConfig.table;

  const model = schema.dmmf.datamodel.models.find(
    (model) => model.name.toLowerCase() === config.model.toLowerCase()
  );

  return (
    model?.fields?.reduce((acc, field) => {
      const hide = columnsToHide?.includes(field.name);
      const isObject = field.kind === "object";
      if (!isObject || hide) return acc;

      return {
        ...acc,
        [field.name]: true,
      };
    }, {}) || {}
  );
};

export const prismaLoader = async ({
  query,
  config,
  clientConfig,
}: {
  query: string;
  config: ConfigTypeServer<any, string>;
  clientConfig: ConfigTypeClient<any, string>;
}) => {
  const fieldsToInclude = getFieldsToInclude({ config, clientConfig });
  const crudRead = config.crud?.read;

  const orderBy = crudRead.orderBy || {
    [crudRead.labelKey]: "asc",
  };

  const _id = query ? (isNaN(+query) ? undefined : +query) : undefined;

  const resultData = await (client[config.model as any] as any)?.findMany({
    orderBy,
    include: fieldsToInclude,
    where: {
      id: {
        equals: _id,
      },
      [crudRead.labelKey]: _id
        ? undefined
        : {
            contains: query,
            mode: "insensitive",
          },
    },
  });

  return parseDefaultLoaderData({
    data: resultData,
    config,
    fieldsToInclude: Object.keys(fieldsToInclude),
  });
};

export const parseDefaultLoaderData = ({
  data,
  config,
  fieldsToInclude,
}: {
  data: any[];
  config: ConfigTypeServer<any, string>;
  fieldsToInclude: string[];
}) => {
  const crudRead = config.crud?.read;

  return data.map((item) => {
    const values = fieldsToInclude.reduce((acc, key) => {
      const _item = item as any;
      const labelKey = crudRead.relationalFields?.[key]?.labelKey || "";

      const value =
        _item[labelKey] ||
        _item[key]?.name ||
        _item[key]?.label ||
        _item[key]?.text;

      if (!value)
        throw new Error(
          `Cannot find value for "${key}". Please specify a "labelKey in the serverConfig for "${config.name}"`
        );

      return {
        ...acc,
        [key]: value,
      };
    }, {});

    return {
      ...item,
      ...values,
    };
  });
};
