import { statuses } from "@/app/config/task/custom-components";

import { useAdminState } from "../client/provider/state";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AdminCommandbarEmpty } from "./admin-commandbar-empty";

export const CommandDialogFooter = () => {
  return (
    <div className="border-t-2 border-gray-200 px-4 py-2 bg-white flex flex-row-reverse  items-center gap-3">
      <CommandFooterCommandsItem
        label="Actions"
        onClick={() => null}
        shortcut="⌘K"
      />

      <div className="w-[3px] bg-gray-300 h-3/4" />

      <CommandFooterItem label="Open" onClick={() => null} shortcut="↵" />
    </div>
  );
};

const CommandFooterCommandsItem = ({
  label,
  onClick,
  shortcut,
}: {
  label: string;
  onClick: () => void;
  shortcut: string;
}) => {
  const { state, emiiter } = useAdminState();
  const commandbarState = state.context.state.commandbar;

  return (
    <div className="flex flex-row justify-center items-center space-x-2">
      <div className="text-xs text-gray-500">{label}</div>

      <div className="flex flex-row gap-1">
        {shortcut
          .slice(0, 1)
          .split("")
          .map((letter) => {
            return (
              <>
                <AdminFooterCommandPopover shortcut={shortcut} label={label} />
              </>
            );
          })}
      </div>
    </div>
  );
};

const CommandFooterItem = ({
  label,
  onClick,
  shortcut,
}: {
  label: string;
  onClick: () => void;
  shortcut: string;
}) => {
  const { state, emiiter } = useAdminState();
  const commandbarState = state.context.state.commandbar;

  return (
    <div className="flex flex-row justify-center items-center space-x-2">
      <div className="text-xs text-gray-500">{label}</div>

      <div className="flex flex-row gap-1">
        {shortcut.split("").map((l) => {
          return (
            <>
              <kbd
                key={`${label}-${l}`}
                className="pointer-events-none -top-[.5px] relative inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
              >
                <span className="text-sm">{l}</span>
              </kbd>
            </>
          );
        })}
      </div>
    </div>
  );
};

const AdminFooterCommandPopover = ({
  label,
  shortcut,
}: {
  label: string;
  shortcut: string;
}) => {
  const { state, emiiter } = useAdminState();
  const commandbarState = state.context.state.commandbar;

  return (
    <Popover
      modal={true}
      open={commandbarState.showCommands}
      onOpenChange={(state) => {
        if (!state) emiiter.clickCommandsClose();
      }}
    >
      <PopoverTrigger asChild>
        <kbd
          key={`${label}-${shortcut}`}
          className="pointer-events-none -top-[.5px] relative inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
        >
          <span className="text-sm">{shortcut}</span>
        </kbd>
      </PopoverTrigger>

      <PopoverContent sideOffset={14} className="p-0" side="top" align="end">
        <Command>
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>

            <CommandGroup>
              {statuses.map((status) => (
                <CommandItem key={status.value}>{status.label}</CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          <div className="border-t-2 border-secondary">
            <CommandInput placeholder="Type a command or search..." />
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
