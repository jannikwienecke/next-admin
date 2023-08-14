import {
  ConfigTypeServer,
  LoaderFunctionType,
} from "@/app/admin-ui/client/admin-utils/base-types";
import { prisma } from "@/app/db";
import { TagInterface } from "./types";

// TODOS
// - [ ] Loaderfunction should be generated from the model
// - [ ] all the crud server actions must be refactored
// - [ ] the combobox component must be refactored

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

export const serverConfig: ConfigTypeServer<TagInterface, keyof typeof prisma> =
  {
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
  };
