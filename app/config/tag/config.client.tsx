import {
  ColumnTypeTest,
  ConfigTypeClient,
} from "@/app/admin-ui/client/admin-utils/base-types";
import { Tag } from "@prisma/client";
import { TagInterface } from "./types";
import { ColorCell } from "./custom-components";
import { TargetIcon } from "@radix-ui/react-icons";
import { prisma } from "@/app/db";

// const columns: ColumnType<TaskType>[] = [
//   {
//     accessorKey: "id",
//     title: "Task",
//     // cell: (value) => <div className="w-[80px]">{value.id}</div>,
//   },
//   {
//     accessorKey: "title",
//     title: "Title",
//     canSort: true,
//     canHide: true,
//   },
//   {
//     accessorKey: "status",
//     title: "Status",
//     // cell: StatusCell,
//   },
//   {
//     accessorKey: "priority",
//     title: "Priority",
//     // cell: PriorityCell,
//   },
// ];

const columns: ColumnTypeTest<TagInterface>[] = [
  {
    title: "Color",
    accessorKey: "Color",
    cell: ColorCell,
    canSort: true,
    canHide: true,
    priority: 0,
  },
];

export const clientConfig: ConfigTypeClient<TagInterface, keyof typeof prisma> =
  {
    model: "tag",
    name: "tag",
    // baseView
    table: {
      columns,
      columnsToHide: ["colorId", "AcitivityTag"],
    },
    form: {
      fieldToHide: ["AcitivityTag", "colorId"],
    },
    navigation: {
      icon: TargetIcon,
      parent: "All",
    },
  };
