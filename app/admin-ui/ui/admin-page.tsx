"use client";

import { CaretLeftIcon, ColorWheelIcon } from "@radix-ui/react-icons";
import React from "react";

import { CommandDialog } from "@/components/ui/command";

import { clientConfig } from "@/app/index.client";
import {
  IDataValue,
  ModelSchema,
  TableFilterProps,
} from "../client/admin-utils/base-types";
import {
  StateMachineProvider,
  StateProvider,
  useAdminState,
} from "../client/provider/state";
import { AdminFormSheet } from "./admin-form-sheet";
import { AdminLayout } from "./admin-layout";
import { AdminPageHeader } from "./admin-page-header";
import { AdminTable } from "./admin-table";
import { usePrevious } from "@uidotdev/usehooks";

export const AdminDashboard = (props: {
  data: IDataValue[];
  modelSchema: ModelSchema;
  filters: TableFilterProps;
}) => {
  return (
    <StateMachineProvider>
      <StateProvider>
        <AdminPage {...props} />
      </StateProvider>
    </StateMachineProvider>
  );
};

const AdminPage = (props: {
  data: IDataValue[];
  modelSchema: ModelSchema;
  filters: TableFilterProps;
}) => {
  const { send, data, columns, routing } = useAdminState();
  const { view, query } = routing;

  const previousView = usePrevious(view);

  React.useEffect(() => {
    if (previousView !== view) {
      send({
        type: "INIT_STATE",
        data: {
          config: clientConfig,
          modelSchema: props.modelSchema,
          query,
          data: props.data,
          view,
          filters: props.filters,
        },
      });
    } else {
      send({
        type: "UPDATE_DATA",
        data: {
          data: props.data,
        },
      });
    }
  }, [
    previousView,
    props.data,
    props.filters,
    props.modelSchema,
    query,
    send,
    view,
  ]);

  return (
    <AdminLayout>
      <>
        {!data.length && props.data.length ? (
          <></>
        ) : (
          <>
            <AdminFormSheet />
            {/* <CommandDialogDemo /> */}

            <div className="hidden h-full flex-1 flex-col space-y-8 py-8 px-6 md:flex">
              <AdminPageHeader />

              <AdminTable />
            </div>
          </>
        )}
      </>
    </AdminLayout>
  );
};

export function CommandDialogDemo() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p> */}
      <CommandDialog open={true} onOpenChange={setOpen}>
        {/* <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <FaceIcon className="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <RocketIcon className="mr-2 h-4 w-4" />
              <span>Launch</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <PersonIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
              <span>Mail</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <GearIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList> */}
        <DetailView />
      </CommandDialog>
    </>
  );
}

const DetailView = () => {
  return (
    <div>
      <div className="flex flex-row justify-between border-b-[1px] border-gray-200 px-2 py-3">
        <div className="flex flex-row items-center gap-2 cursor-pointer rounded-full bg-gray-200 p-1">
          <CaretLeftIcon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex flex-row border-r-[1px] border-r-gray-200">
        {/* main */}
        <div className="flex flex-col w-2/3">
          <div className="py-8 px-6 border-b-[1px] border-b-gray-200 flex flex-row items-center space-x-5">
            <ColorWheelIcon className="h-14 w-16 ml-2 bg-indigo-500 text-white p-2 rounded-xl" />
            <div className="text-3xl flex flex-row justify-between w-full items-center">
              <div className="font-bold">FunnyStuff</div>
              <div className="rounded-lg text-xl bg-gray-100 py-2 border-gray-300 border-[1px] px-4">
                tag
              </div>
            </div>
          </div>

          <div className="min-h-[25rem] py-8 px-6 flex flex-col space-y-2">
            <label className="block text-base font-sm text-gray-600 font-semibold ">
              Author
            </label>

            <div className="block text-base font-medium text-black ">
              Jannik Wiencke
            </div>

            <label className="block text-base font-sm text-gray-600 font-semibold ">
              Description:
            </label>

            <div className="block text-base font-medium text-black ">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              voluptatum, voluptate, quibusdam, quia voluptas quod quos
            </div>
          </div>
        </div>

        <div className="w-1/3 border-l-[1px] border-l-gray-200 px-4 py-8">
          <div className="min-h-[25rem] flex flex-col space-y-2">
            <label className="block text-base font-sm text-gray-600 font-semibold ">
              Title
            </label>

            <div className="block text-base font-medium text-black ">
              Test 123
            </div>

            <label className="block text-base font-sm text-gray-600 font-semibold ">
              Last update:
            </label>

            <div className="block text-base font-medium text-black ">
              2021-09-09
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailViewLabel = (props: { label: string }) => {
  return (
    <div className="block text-base font-sm text-gray-600 font-semibold ">
      {props.label}
    </div>
  );
};

const DetailViewValue = (props: { value: string }) => {
  return (
    <div className="block text-base font-medium text-black ">{props.value}</div>
  );
};
