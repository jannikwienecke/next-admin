import { createClientView } from "@/app/admin-ui/server/utils";
import { ColorWheelIcon, TargetIcon } from "@radix-ui/react-icons";
import { ColorInterface } from "./types";
import { prisma } from "@/app/db";
import { IStatus } from "@prisma/client";

export default createClientView<IStatus, keyof typeof prisma>({
  model: "iStatus",
  name: "iStatus",
  label: "iStatus",
  labelKey: "label",
  // baseView
  table: {
    columns: [],
    filter: [],
    // columnsToHide: ["Tag"],
    // filter: ["Color", "label"],
  },
  form: {
    // fieldToHide: ["Tag"],
    // fieldToHide: ["AcitivityTag", "colorId"],
  },
  navigation: {
    icon: TargetIcon,
    parent: "All",
  },
});
