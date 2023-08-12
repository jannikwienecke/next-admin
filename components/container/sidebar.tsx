import {
  SidebarCategoryProps,
  SidebarItemProps,
} from "@/app/admin-utils/base-types";
import { Button } from "@/components/ui/button";
// MAYBE NEED LATER
// import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  categories: SidebarCategoryProps[];
}

export function Sidebar({ className, categories }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        {categories.map((category) => (
          <SidebarCategory key={category.label} {...category} />
        ))}
      </div>
    </div>
  );
}

const SidebarCategory = ({
  label,
  items,
}: {
  label: string;
  items: SidebarItemProps[];
}) => {
  return (
    <div className="px-3 py-2">
      <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
        {label}
      </h2>

      <div className="space-y-1">
        {items.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
};

const SidebarItem = ({ label, active, ...props }: SidebarItemProps) => {
  const variant = active ? "secondary" : "ghost";
  return (
    <Button
      onClick={props.onClick}
      variant={variant}
      className="w-full justify-start"
    >
      <props.icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
};
