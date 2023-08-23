import { ColumnTypeTest } from "@/app/admin-ui/client/admin-utils/base-types";
import { createClientView } from "@/app/admin-ui/server/utils";
import { TargetIcon } from "@radix-ui/react-icons";
import { ColorCell } from "./custom-components";
import { TagInterface } from "./types";
import { prisma } from "@/app/db";
import { ITask } from "@prisma/client";

// const columns: ColumnTypeTest<TagInterface>[] = [
//   {
//     title: "Color",
//     accessorKey: "Color",
//     cell: ColorCell,
//     canSort: true,
//     canHide: true,
//     priority: 0,
//   },
// ];

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
