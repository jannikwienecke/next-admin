import { createClientView } from "@/app/admin-ui/server/utils";
import { ColorWheelIcon, TargetIcon } from "@radix-ui/react-icons";
import { ColorInterface } from "./types";

export default createClientView<ColorInterface, "color">({
  model: "color",
  name: "color",
  label: "Colors",
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
