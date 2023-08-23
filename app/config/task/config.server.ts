import { LoaderFunctionType } from "@/app/admin-ui/client/admin-utils/base-types";
import { createServerView } from "@/app/admin-ui/server/utils";
import { prisma } from "@/app/db";
import { TagInterface } from "./types";
import { ITask } from "@prisma/client";

export const loader: LoaderFunctionType<TagInterface> = async ({ query }) => {
  const tags = await prisma.tag.findMany({
    orderBy: {
      label: "asc",
    },
    where: {
      label: {
        // use here the labelKey
        contains: query,
        mode: "insensitive",
      },
    },
    include: {
      Color: true,
    },
  });
  return {
    data: tags.map((tag) => ({
      ...tag,
      Color: tag.Color.name,
    })),
  };
};

export default createServerView<ITask, keyof typeof prisma>({
  model: "iTask",
  name: "task",
  crud: {
    read: {
      // loader,
      orderBy: {
        title: "asc",
      },
      labelKey: "title",
      relationalFields: {},
    },
  },
});
