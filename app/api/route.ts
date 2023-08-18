import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {
  ComboboxItemProps,
  IDataValue,
} from "../admin-ui/client/admin-utils/base-types";
import { getConfigByModel } from "../admin-ui/server/utils";
import { prisma } from "../db";
import { serverConfig } from "../index.server";

// TODO - [ ] REFACOTR THIS

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  const modelName = request.nextUrl.searchParams.get("model");

  const model = Prisma.dmmf.datamodel.models.find(
    (m) => m.name.toLowerCase() === modelName?.toLowerCase()
  );

  if (!model) throw new Error("Model not found");

  const config = getConfigByModel(serverConfig, model.name);

  const possibleLabelKeys: string[] = [];

  const fieldsTo = model?.fields
    .filter((f) => f.type === "String")
    .map((c) => {
      return {
        [c.name]: {
          contains: query ?? "",
          mode: "insensitive",
        },
      };
    });

  model.fields.forEach((f) => {
    if (f.type === "String") {
      possibleLabelKeys.push(f.name);
    }
  });

  const _model = model.name[0].toLowerCase() + model.name.slice(1);

  const dbModel = (prisma as any)?.[_model];
  if (!dbModel) throw new Error("dbModel not found");

  const values = await dbModel?.findMany({
    where: {
      OR: fieldsTo,
    },
    take: 10,
  });

  const labelKeys = [
    config?.crud.read.labelKey,
    "name",
    "label",
    "title",
    ...possibleLabelKeys,
  ];

  const keyWithValue = labelKeys.find((k) => values[0]?.[k as any]);

  if (!keyWithValue && values.length > 0) {
    throw new Error("keyWithValue not found");
  }

  const parsedResult: ComboboxItemProps[] = values.map((c: IDataValue) => ({
    value: c.id,
    label: c?.[keyWithValue as any],
  }));

  return NextResponse.json(parsedResult);
}
