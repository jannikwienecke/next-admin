import { PRODVIDER } from "@/app/admin-ui";
import {
  ConfigTypeClient,
  ConfigTypeServer,
  SortingProps,
} from "@/app/admin-ui/client/admin-utils/base-types";
import { clientConfig } from "@/app/index.client";
import { serverConfig } from "@/app/index.server";
import { getConfigByModel, getPrismaModelSchema } from "../utils";

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
      if (field.isList) return acc;

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
  sorting,
  id,
}: {
  query: string;
  sorting?: SortingProps;
  config: ConfigTypeServer<any, string>;
  clientConfig: ConfigTypeClient<any, string>;
  id?: number;
}) => {
  const fieldsToInclude = getFieldsToInclude({ config, clientConfig });

  const crudRead = config.crud?.read;

  const fields = prismaGetFieldsForModel({ model: config.model });

  // if is relational field
  // we need to find the config for this relational field - By the model name
  // if so we need to use the labelKey for the sorting
  const isRelationalField = fields.find(
    (f) => f.name === sorting?.id && f.relationFromFields?.length
  );

  const newConfig = getConfigByModel(serverConfig, sorting?.id!);

  if (isRelationalField && !newConfig) {
    throw new Error(`Cannot find config for model "${sorting?.id}"`);
  }

  const orderBy = sorting?.id
    ? !isRelationalField && !newConfig
      ? {
          [sorting.id]: sorting.direction,
        }
      : {
          [sorting.id]: {
            [newConfig!.crud.read.labelKey]: sorting.direction,
          },
        }
    : crudRead.orderBy || {
        [crudRead.labelKey]: "asc",
      };

  const _id = query ? (isNaN(+query) ? undefined : +query) : undefined;

  const include = Object.keys(fieldsToInclude).length
    ? fieldsToInclude
    : undefined;

  const resultData = await (client[config.model as any] as any)?.findMany({
    orderBy,
    include,
    take: 10,
    where: {
      id: {
        equals: _id || id || undefined,
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

  const currentSchema = getPrismaModelSchema(schema, config.model);

  return data.map((item) => {
    const values = fieldsToInclude.reduce((acc, key) => {
      const _item = item as any;
      const labelKey = crudRead.relationalFields?.[key]?.labelKey || "";

      const val = _item[key];

      if (Array.isArray(val)) {
        return acc;
      }

      const value =
        _item[key][labelKey] ||
        _item[key]?.name ||
        _item[key]?.label ||
        _item[key]?.text;

      if (!value)
        throw new Error(
          `Cannot find value for "${key}". Please specify a "labelKey in the serverConfig for "${config.name}"`
        );

      let parsedVal = value;

      // if (typeof value === 'object')

      return {
        ...acc,
        [key]: parsedVal,
      };
    }, {});

    const resu = currentSchema?.fields.reduce((acc, field) => {
      const value = item[field.name];

      if (!value) return acc;

      if (value instanceof Date) {
        return {
          ...acc,
          [field.name]: value.toLocaleString("De-de").slice(0, 16),
        };
      }

      return {
        ...acc,
        [field.name]: value,
      };
    }, {} as any);

    return {
      ...resu,
      ...values,
    };
  });
};

export const prismaGenerateDataObject = ({
  config,
  actionData,
}: {
  config: ConfigTypeServer<any, string>;
  actionData: Record<string, any>;
}) => {
  const fields = prismaGetFieldsForModel({
    model: config.model,
  });

  const keyDateUpdated = config.crud.read.mappings?.dateUpdated;

  const x = fields
    .filter((f) => f.kind === "object")
    .map((f) => f.relationFromFields)
    .flat();

  return fields.reduce((p, currentField) => {
    if (x.includes(currentField.name)) return p;
    if (currentField.isList) return p;

    let value = actionData[currentField.name];
    const isRequired = currentField.isRequired;

    if (currentField.name === "id") {
      return p;
    }

    if (!isRequired && !value) {
      return p;
    }

    if (keyDateUpdated && currentField.name === keyDateUpdated) {
      value = new Date();
    }

    const relationalField = currentField.relationFromFields?.length;

    const hasDefault = currentField?.hasDefaultValue;

    if (relationalField) {
      const _value =
        typeof value === "object" && "value" in value ? value.value : value;
      return {
        ...p,
        [currentField.name]: {
          connect: {
            id: currentField.type === "Int" ? +_value : _value,
          },
        },
      };
    }

    if (isRequired && !value && !hasDefault) {
      throw new Error(`Field "${currentField.name}" is required`);
    }

    return {
      ...p,
      [currentField.name]: value || undefined,
    };
  }, {} as any);
};

export const prismaGetIdFieldType = ({
  config,
}: {
  config: ConfigTypeServer<any, string>;
}): "string" | "int" => {
  const fields = prismaGetFieldsForModel({ model: config.model });

  const idField = fields.find((f) => f.name === "id");

  if (!idField) {
    throw new Error(`Cannot find id field for model "${config.model}"`);
  }

  return idField.type === "Int" ? "int" : "string";
};

export const prismaCreate = async ({
  data,
  model,
}: {
  data: Record<string, any>;
  model: string;
}) => {
  return await (client[model as any] as any).create({
    data,
  });
};

export const prismaDelete = async ({
  id,
  model,
}: {
  id: number | string;
  model: string;
}) => {
  return await (client[model as any] as any).delete({
    where: {
      id,
    },
  });
};

export const prismaUpdate = async ({
  id,
  data,
  model,
}: {
  id: number | string;
  data: Record<string, any>;
  model: string;
}) => {
  return await (client[model as any] as any).update({
    where: {
      id,
    },
    data,
  });
};

export const prismaGetFieldsForModel = ({ model }: { model: string }) => {
  return (
    schema.dmmf.datamodel.models.find(
      (m) => m.name.toLowerCase() == model.toLowerCase()
    )?.fields || []
  );
};

export const prismRead = async ({
  id,
  config,
}: {
  id: number | string;
  config: ConfigTypeServer<any, string>;
}) => {
  const clientConfigModel =
    clientConfig[config.name as keyof typeof clientConfig];

  const res = await prismaLoader({
    query: "",
    clientConfig: clientConfigModel,
    config,
    id: +id,
  });

  return res?.[0];
};
