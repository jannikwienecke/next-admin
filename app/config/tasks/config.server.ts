import { ConfigTypeServer } from "@/app/admin-utils/base-types";
import { prisma } from "@/app/db";
import { Tag } from "@prisma/client";
import { TagInterface } from "./types";

export const loader = async (): Promise<{
  data: TagInterface[];
}> => {
  const tags = await prisma.tag.findMany({
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
