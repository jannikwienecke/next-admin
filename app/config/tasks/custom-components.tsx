import { BaseCell } from "@/app/admin-utils/base-components";
import { CellComponent } from "@/app/admin-utils/base-types";
import {
  QuestionMarkCircledIcon,
  CircleIcon,
  StopwatchIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import { TagInterface } from "./types";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "todo",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];

// export const StatusCell: CellComponent<TaskType> = (data) => {
//   const status = statuses.find((status) => status.value === data.status);

//   if (!status) {
//     return null;
//   }

//   return (
//     <BaseCell icon={status.icon} label={status.label} className="w-[140px]" />
//   );
// };

export const ColorCell: CellComponent<TagInterface> = (data) => {
  return (
    <div style={{ color: data.Color }} className="w-[80px]">
      {data.Color}
    </div>
  );
};
