import { ITask } from "@prisma/client";
import { TargetIcon } from "@radix-ui/react-icons";
import { createClientView } from "../../../app/admin-ui/server/utils";
import { prisma } from "../../../app/db";

export default createClientView<ITask, keyof typeof prisma>({
  model: "iTask",
  name: "task",
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
    icon: TargetIcon,
    parent: "All",
  },
});
