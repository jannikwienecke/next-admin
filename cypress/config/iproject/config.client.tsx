import { IProject } from "@prisma/client";
import { FileIcon } from "@radix-ui/react-icons";
import { createClientView } from "../../../app/admin-ui/server/utils";
import { prisma } from "../../../app/db";

export default createClientView<IProject, keyof typeof prisma>({
  model: "iProject",
  name: "iProject",
  label: "Projects",
  labelKey: "name",
  // baseView
  table: {
    columns: [],
    filter: ["name"],
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
