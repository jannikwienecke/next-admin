import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface DropdownItemProps {
  id: string;
  label: string;
  isChecked: boolean;
  onCheck: (isChecked?: boolean) => void;
  isCheckbox?: boolean;
  isRadio?: boolean;
  subItems?: DropdownItemProps[];
}

export interface DropdownProps {
  title: string;
  items: DropdownItemProps[];
  TriggerButton?: React.ReactNode;
  headline?: string;
  size?: "sm" | "default" | "lg";
}
export function Dropdown({
  title,
  items,
  TriggerButton,
  headline,
  size,
}: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {TriggerButton ? (
          TriggerButton
        ) : (
          <Button
            variant="outline"
            size={size || "sm"}
            className="ml-auto hidden h-12 lg:flex"
          >
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            {title}
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[150px]">
        {headline ? (
          <DropdownMenuLabel>
            {/* Toggle columns */}
            {headline}
          </DropdownMenuLabel>
        ) : null}
        <DropdownMenuSeparator />

        {items.map((column) => {
          return (
            <div key={column.id}>
              {column.isCheckbox ? (
                <>
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.isChecked}
                    onCheckedChange={(value) => column.onCheck(!!value)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                </>
              ) : column.subItems?.length && column.subItems?.[0].isCheckbox ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      {column.label}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {/* <DropdownMenuRadioGroup value="isBug"> */}
                      {column.subItems.map((subItem) => (
                        <DropdownMenuCheckboxItem
                          key={subItem.id}
                          className="capitalize"
                          checked={subItem.isChecked}
                          onCheckedChange={(value) => subItem.onCheck(!!value)}
                        >
                          {subItem.label}
                        </DropdownMenuCheckboxItem>
                      ))}
                      {/* </DropdownMenuRadioGroup> */}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => column.onCheck()}>
                    {column.label}
                  </DropdownMenuItem>
                </>
              )}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
