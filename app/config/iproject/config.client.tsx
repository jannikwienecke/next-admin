import { createClientView } from "@/app/admin-ui/server/utils";
import { ColorWheelIcon, FileIcon, TargetIcon } from "@radix-ui/react-icons";
import { ColorInterface } from "./types";
import { prisma } from "@/app/db";
import { IProject, IStatus } from "@prisma/client";

export default createClientView<IProject, keyof typeof prisma>({
  model: "iProject",
  name: "iProject",
  label: "Projects",
  labelKey: "name",
  // baseView
  table: {
    columns: [],
    filter: [],
  },
  form: {
    // fieldToHide: ["Tag"],
    // fieldToHide: ["AcitivityTag", "colorId"],
  },
  navigation: {
    icon: FileIcon,
    parent: "All",
  },
});
