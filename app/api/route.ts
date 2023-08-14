import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ComboboxItemProps } from "../admin-utils/base-types";
import { prisma } from "../db";
import { LL } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  const modelName = request.nextUrl.searchParams.get("model");

  const model = Prisma.dmmf.datamodel.models.find((m) => m.name === modelName);

  const fieldsTo = model?.fields
    .filter((f) => f.type === "String")
    .reduce((p, c) => {
      return {
        ...p,
        [c.name]: {
          contains: query ?? "",
        },
      };
    }, {});

  const colors = await prisma.color.findMany({
    where: {
      OR: fieldsTo,
    },
    take: 10,
  });

  const parsedResult: ComboboxItemProps[] = colors.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  return NextResponse.json(parsedResult);
}
