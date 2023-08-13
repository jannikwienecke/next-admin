import {
  ConfigTypeServer,
  LoaderFunctionType,
} from "@/app/admin-utils/base-types";
import { prisma } from "@/app/db";
import { TagInterface } from "./types";

export const loader: LoaderFunctionType<TagInterface> = async ({ query }) => {
  const tags = await prisma.tag.findMany({
    where: {
      label: {
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

export const serverConfig: ConfigTypeServer<TagInterface> = {
  model: "Tag",
  name: "tag",
  data: {
    loader,
  },
};
