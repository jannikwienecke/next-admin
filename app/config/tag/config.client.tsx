import { ColumnTypeTest } from "@/app/admin-ui/client/admin-utils/base-types";
import { createClientView } from "@/app/admin-ui/server/utils";
import { TargetIcon } from "@radix-ui/react-icons";
import { ColorCell } from "./custom-components";
import { TagInterface } from "./types";

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

export default createClientView<TagInterface, "tag">({
  model: "tag",
  name: "tag",
  label: "Tags",
  // baseView
  table: {
    columns,
    columnsToHide: ["colorId", "AcitivityTag"],
    filter: ["Color", "label"],
  },
  form: {
    fieldToHide: ["AcitivityTag", "colorId"],
  },
  navigation: {
    icon: TargetIcon,
    parent: "All",
  },
});
