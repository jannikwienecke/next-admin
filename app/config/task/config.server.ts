import { createServerView } from "@/app/admin-ui/server/utils";
import { prisma } from "@/app/db";
import { ITask } from "@prisma/client";

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
