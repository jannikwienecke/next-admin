import { Dropdown, DropdownItemProps } from "@/components/container/drop-down";
import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LL } from "@/lib/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

interface DataTableRowActionsProps {
  items: DropdownItemProps[];
}

export function AdminTableRowActions({ items }: DataTableRowActionsProps) {
  return (
    <Dropdown
      title="Actions"
      TriggerButton={
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
      }
      items={items}
    />
  );
}
