"use server";

import { revalidatePath } from "next/cache";
import { crud, generateDataObject, getIdFieldType } from "./adapter";
import { getConfigByView } from "./utils";
import { serverConfig } from "@/app/index.server";
import { SortingProps } from "../client/admin-utils/base-types";

type Action = {
  name: "create" | "edit" | "delete" | "getSingleRecord";
  data: Record<string, any>;
};

type ServerEventsProps = {
  action: Action; // Sorting;
  viewName: string;
};

export async function serverAction(props: ServerEventsProps) {
  const { action } = props;

  console.log("serverAction", props);

  const actionFn = ACTION_DICT[action.name];

  if (!actionFn) {
    throw new Error(`Action "${action.name}" not found`);
  }

  const res = await actionFn(props);

  revalidatePath("/");
  return res;
}

const _create = async ({ action, viewName }: ServerEventsProps) => {
  const { id, ...rest } = action.data || {};
  const config = getConfigByView(serverConfig, viewName);

  const data = generateDataObject({
    config,
    actionData: rest,
  });

  const newItem = await crud.create({ data, model: config.model });

  const item = await _getSingleRecord({
    viewName,
    action: {
      ...action,
      data: {
        id: newItem.id,
      },
    },
  });
  return item;
};

const _delete = async ({ action, viewName }: ServerEventsProps) => {
  const config = getConfigByView(serverConfig, viewName);
  const { id } = action.data || {};

  const idFieldType = getIdFieldType({ config });

  return await crud.delete({
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

  return await crud.update({
    id: idFieldType === "int" ? +id : id,
    data,
    model: config.model,
  });
};

const _getSingleRecord = async ({ action, viewName }: ServerEventsProps) => {
  const { id } = action.data || {};
  const config = getConfigByView(serverConfig, viewName);

  const idFieldType = getIdFieldType({ config });

  const data = await crud.read({
    config,
    id: idFieldType === "int" ? +id : id,
  });

  return data;
};

const ACTION_DICT: {
  [key in "create" | "edit" | "delete" | "getSingleRecord"]: (
    props: ServerEventsProps
  ) => Promise<any>;
} = {
  create: _create,
  edit: _edit,
  delete: _delete,
  getSingleRecord: _getSingleRecord,
};
