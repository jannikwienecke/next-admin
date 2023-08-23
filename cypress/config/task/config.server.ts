import { ITask } from "@prisma/client";
import { createServerView } from "../../../app/admin-ui/server/utils";
import { prisma } from "../../../app/db";

export default createServerView<ITask, keyof typeof prisma>({
  model: "iTask",
  name: "task",
  crud: {
    read: {
      orderBy: {
        title: "asc",
      },
      labelKey: "title",
      relationalFields: {},
    },
  },
});
