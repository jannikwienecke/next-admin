"use server";

import { revalidatePath } from "next/cache";
import { crud, generateDataObject, getIdFieldType } from "./adapter";
import { getConfigByView } from "./utils";
import { serverConfig } from "@/app/index.server";

type Action = {
  name: "create" | "edit" | "delete";
  data: Record<string, any>;
};

type ServerEventsProps = {
  action: Action;
  viewName: string;
};

export async function serverAction(props: ServerEventsProps) {
  const { action } = props;

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
  const config = getConfigByView(serverConfig, viewName);

  const data = generateDataObject({
    config,
    actionData: rest,
  });

  await crud.create({ data, model: config.model });
};

const _delete = async ({ action, viewName }: ServerEventsProps) => {
  const config = getConfigByView(serverConfig, viewName);
  const { id } = action.data || {};

  const idFieldType = getIdFieldType({ config });

  await crud.delete({
    id: idFieldType === "int" ? +id : id,
    model: config.model,
  });
};

const _edit = async ({ action, viewName }: ServerEventsProps) => {
  const { id, ...rest } = action.data || {};
  const config = getConfigByView(serverConfig, viewName);

  const idFieldType = getIdFieldType({ config });

  const data = generateDataObject({
    config,
    actionData: rest,
  });

  await crud.update({
    id: idFieldType === "int" ? +id : id,
    data,
    model: config.model,
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
