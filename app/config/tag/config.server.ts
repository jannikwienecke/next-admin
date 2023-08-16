import { LoaderFunctionType } from "@/app/admin-ui/client/admin-utils/base-types";
import { createServerView } from "@/app/admin-ui/server/utils";
import { prisma } from "@/app/db";
import { TagInterface } from "./types";

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

export default createServerView<TagInterface, "tag">({
  model: "tag",
  name: "tag",
  crud: {
    read: {
      // loader,
      orderBy: {
        label: "asc",
      },
      labelKey: "label",
      relationalFields: {
        Color: {
          labelKey: "name",
        },
        AcitivityTag: {
          labelKey: "AcitivityTag",
        },
      },
    },
  },
});
