import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../db";
import { Prisma } from "@prisma/client";

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

  return NextResponse.json(
    colors.map((c) => ({
      value: c.id,
      label: c.name,
    }))
  );
}
