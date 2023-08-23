import { IStatus } from "@prisma/client";
import { ColorWheelIcon } from "@radix-ui/react-icons";
import { createClientView } from "../../../app/admin-ui/server/utils";
import { prisma } from "../../../app/db";

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
    icon: ColorWheelIcon,
    parent: "All",
  },
});
