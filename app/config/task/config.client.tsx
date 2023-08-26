import { createClientView } from "@/app/admin-ui/server/utils";
import { prisma } from "@/app/db";
import { ITask } from "@prisma/client";
import { CookieIcon } from "@radix-ui/react-icons";

export default createClientView<ITask, keyof typeof prisma>({
  model: "iTask",
  name: "task",
  description: "Here you can manage your tasks",
  label: "Tasks",
  labelKey: "title",
  // baseView
  table: {
    columns: [],
    columnsToHide: [],
    filter: [],
    // filter: ["Color", "label"],
  },
  form: {
    // fieldToHide: ["AcitivityTag", "colorId"],
  },
  navigation: {
    icon: CookieIcon,
    parent: "All",
  },
});
