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

  return fields.reduce((p, c) => {
    if (c.kind === "object") {
      return p;
    }

    const value = actionData[c.name];
    const isRequired = c.isRequired;

    if (c.name === "id") {
      return p;
    }

    if (!isRequired && !value) {
      return p;
    }

    const field = fields.find((f) => f.relationFromFields?.[0] === c.name);

    if (field) {
      return {
        ...p,
        [field.name]: {
          connect: {
            id: c.type === "Int" ? +value : value,
          },
        },
      };
    }

    if (isRequired && !value) {
      throw new Error(`Field "${c.name}" is required`);
    }

    return {
      ...p,
      [c.name]: value,
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
  await (client[model as any] as any).create({
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
  await (client[model as any] as any).delete({
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
  await (client[model as any] as any).update({
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
