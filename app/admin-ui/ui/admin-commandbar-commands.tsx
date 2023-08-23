import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { FileIcon } from "@radix-ui/react-icons";
import { ICommand } from "../client/admin-utils/base-types";
import { useAdminCommandState } from "../client/provider/hooks";
import { useAdminState } from "../client/provider/state";
import { AdminCommandbarEmpty } from "./admin-commandbar-empty";
import { CommandDialogFooter } from "./admin-commandbar-footer";

export const CommandsView = () => {
  const { commandbar } = useAdminState();
  const allActions = commandbar.view.commands?.actions || [];
  const suggestions = commandbar.view.commands?.suggestions || [];

  const { filtered, query, getInputProps, getEmptyProps } =
    useAdminCommandState({
      commands: [...allActions, ...suggestions],
    });

  return (
    <>
      <CommandInput {...getInputProps()} />

      <CommandList className="h-[25rem]">
        <AdminCommandbarEmpty {...getEmptyProps()} />

        {filtered && query.length > 0 ? (
          <>
            <CommandGroup heading="Results">
              {suggestions.map((suggestion) => (
                <AdminCommandItem key={suggestion.label} item={suggestion} />
              ))}
            </CommandGroup>
          </>
        ) : (
          <>
            <CommandGroup heading="Suggestions">
              {suggestions.map((suggestion) => (
                <AdminCommandItem key={suggestion.label} item={suggestion} />
              ))}
            </CommandGroup>

            {allActions.length ? (
              <>
                <CommandSeparator />
                <CommandGroup heading="Actions">
                  {allActions.map((a) => (
                    <AdminCommandItem key={a.label} item={a} />
                  ))}
                </CommandGroup>
              </>
            ) : null}
          </>
        )}
      </CommandList>

      <CommandDialogFooter />
    </>
  );
};

const AdminCommandItem = ({ item: item }: { item: ICommand }) => {
  const { emiiter } = useAdminState();

  return (
    <CommandItem
      onSelect={() => emiiter.clickCommandbarAction(item)}
      key={item.label}
    >
      {item.icon ? (
        <item.icon className="mr-2 h-4 w-4" />
      ) : (
        <FileIcon className="mr-2 h-4 w-4" />
      )}
      <span>{item.label}</span>
      {/* <CommandShortcut>⌘P</CommandShortcut> */}
    </CommandItem>
  );
};

{
  /* <CommandItem>
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Calendar2</span>
          </CommandItem>
          <CommandItem>
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Calendar3</span>
          </CommandItem>
          <CommandItem>
            <FaceIcon className="mr-2 h-4 w-4" />
            <span>Search Emoji</span>
          </CommandItem>
          <CommandItem>
            <RocketIcon className="mr-2 h-4 w-4" />
            <span>Launch</span>
          </CommandItem> */
}
