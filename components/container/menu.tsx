import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

interface MenuProps {
  items: MenuItemProps[];
}

interface MenuItemProps {
  label: string;
  subItems?: MenuSubItemProps[];
  checkbox?: boolean;
}

interface MenuSubItemProps {
  label: string;
  shortcut?: string;
  isChecked?: boolean;
  items?: MenuSubItemProps[];
  disabled?: boolean;
  onClick?: () => void;
}

export function Menu({ items }: MenuProps) {
  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
      {items.map(({ label, subItems, checkbox }) => {
        return (
          <MenubarMenu key={label}>
            <MenubarTrigger className="font-bold">{label}</MenubarTrigger>

            <MenubarContent>
              {subItems?.map(
                (
                  { label, shortcut, isChecked, items, disabled, onClick },
                  index
                ) => {
                  return (
                    <>
                      {checkbox ? (
                        <>
                          <MenubarCheckboxItem
                            disabled={disabled}
                            checked={isChecked}
                          >
                            {label}
                          </MenubarCheckboxItem>
                        </>
                      ) : items?.length ? (
                        <>
                          <MenubarSub>
                            <MenubarSubTrigger>{label}</MenubarSubTrigger>
                            <MenubarSubContent className="w-[230px]">
                              {items.map((item) => {
                                return (
                                  <MenubarItem
                                    onClick={item.onClick}
                                    disabled={item.disabled}
                                    key={`sub-item-${item.label}`}
                                  >
                                    {item.label}
                                    {item.shortcut ? (
                                      <MenubarShortcut>
                                        {item.shortcut}
                                      </MenubarShortcut>
                                    ) : null}
                                  </MenubarItem>
                                );
                              })}
                            </MenubarSubContent>
                          </MenubarSub>
                        </>
                      ) : (
                        <MenubarItem
                          onClick={onClick}
                          disabled={disabled}
                          key={label}
                        >
                          {label}
                          {shortcut ? (
                            <MenubarShortcut>{shortcut}</MenubarShortcut>
                          ) : null}
                        </MenubarItem>
                      )}
                      {index !== subItems.length - 1 && <MenubarSeparator />}
                    </>
                  );
                }
              )}
            </MenubarContent>
          </MenubarMenu>
        );
      })}
    </Menubar>
  );
}
