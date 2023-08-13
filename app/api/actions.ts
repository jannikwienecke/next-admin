"use server";

import { Prisma } from "@prisma/client";
import { ViewName } from "../admin-utils/base-types";
import { serverConfig } from "../config/index.server";
import { prisma } from "../db";
import { revalidatePath } from "next/cache";
import { LL } from "@/lib/utils";

type Action = {
  name: "create" | "edit" | "delete";
  data: Record<string, any>;
};

type ServerEventsProps = {
  action: Action;
  viewName: ViewName;
};

export async function serverAction(props: ServerEventsProps) {
  const { action, viewName } = props;
  const config = Object.values(serverConfig).find((c) => c.name == viewName);

  console.log(config, action);

  const actionFn = ACTION_DICT[action.name];

  if (!actionFn) {
    throw new Error(`Action "${action.name}" not found`);
  }

  await actionFn(props);

  revalidatePath("/");
  return;
}

const _create = async ({ action, viewName }: ServerEventsProps) => {
  const { id, ...rest } = action.data || {};
  const config = Object.values(serverConfig).find((c) => c.name == viewName);
  const fields = Prisma.dmmf.datamodel.models.find(
    (m) => m.name == config?.model
  );
  const model = config?.model;

  if (!model) throw new Error(`Model "${model}" not found`);

  const dataToInsert = fields?.fields.reduce((p, c) => {
    if (c.kind === "object") {
      return p;
    }

    const value = rest[c.name];
    const isRequired = c.isRequired;

    if (c.name === "id") {
      return p;
    }

    if (!isRequired && !value) {
      return p;
    }

    const field = fields.fields.find(
      (f) => f.relationFromFields?.[0] === c.name
    );

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

  await (prisma[model as any] as any).create({
    data: dataToInsert,
  });
};

const _delete = async ({ action, viewName }: ServerEventsProps) => {
  const config = Object.values(serverConfig).find((c) => c.name == viewName);
  const model = config?.model as any;

  const fields =
    Prisma.dmmf.datamodel.models.find((m) => m.name == config?.model)?.fields ||
    [];

  const idField = fields.find((f) => f.name === "id");

  if (!model) throw new Error(`Model "${model}" not found`);

  const { id } = action.data || {};

  await (prisma[model] as any).delete({
    where: {
      id: idField?.type === "Int" ? +id : id,
    },
  });
};

const _edit = async ({ action, viewName }: ServerEventsProps) => {
  const { id, ...rest } = action.data || {};
  const config = Object.values(serverConfig).find((c) => c.name == viewName);
  const fields = Prisma.dmmf.datamodel.models.find(
    (m) => m.name == config?.model
  );
  const model = config?.model;

  if (!model) throw new Error(`Model "${model}" not found`);

  const dataToUpdate = fields?.fields.reduce((p, c) => {
    if (c.kind === "object") {
      return p;
    }

    const value = rest[c.name];
    const isRequired = c.isRequired;

    if (c.name === "id") {
      return p;
    }

    if (!isRequired && !value) {
      return p;
    }

    const field = fields.fields.find(
      (f) => f.relationFromFields?.[0] === c.name
    );

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

  await (prisma[model as any] as any).update({
    where: {
      id: id ? +id : undefined,
    },
    data: dataToUpdate,
  });
};

const ACTION_DICT: {
  [key in "create" | "edit" | "delete"]: (
    props: ServerEventsProps
  ) => Promise<any>;
} = {
  create: _create,
  edit: _edit,
  delete: _delete,
};
