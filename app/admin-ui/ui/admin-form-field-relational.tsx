"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { useDebounce } from "@uidotdev/usehooks";
import * as React from "react";
import { FormFieldType } from "../client/admin-utils/base-types";
import { useAdminState } from "../client/provider/state";

interface ComboboxItemProps {
  value: number;
  label: string;
}

export const RelationFormInputField = ({
  ...props
}: FormFieldType & {
  onAddNew: (props: { value: string }) => void;
}) => {
  return <AdminRelationCombobox {...props} />;
};

function AdminRelationCombobox({
  relation,
  onAddNew,
  ...props
}: FormFieldType & {
  onAddNew: (props: { value: string }) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const { emiiter } = useAdminState();

  const defaultValue: ComboboxItemProps | undefined = (
    props.defaultValue as any
  )?.label
    ? (props.defaultValue as any)
    : undefined;

  const [value, setValue] = React.useState(defaultValue?.value as number);
  const [defaultItems, setDefaultItems] = React.useState<ComboboxItemProps[]>();
  const [items, setItems] = React.useState<ComboboxItemProps[]>();

  if (!relation) throw new Error("No relation");

  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);

  const cancelRef = React.useRef(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `api?query=${debouncedQuery}&model=${relation.modelName}`
        );

        const data = (await res.json()) as ComboboxItemProps[];

        if (cancelRef.current) return;

        if (data.length > 0 && !defaultItems) {
          const defaultItemsIncludesValue = data?.find(
            (item: any) => item.value === defaultValue?.value
          );

          if (defaultItemsIncludesValue) {
            setDefaultItems(data);
            setItems(data);
          } else {
            if (defaultValue) {
              setItems([...data, defaultValue]);
              setDefaultItems([...data, defaultValue]);
            } else {
              setItems(data);
              setDefaultItems(data);
            }
          }
        } else {
          setItems(data);
        }
      } catch (error) {
        console.log("Error Relational Search: ", { error });
      }
    };
    if (defaultItems?.length && debouncedQuery === "") return;
    fetchData();
  }, [debouncedQuery, defaultItems, defaultValue, relation.modelName]);

  React.useEffect(() => {
    if (query === "" && defaultItems?.length) {
      cancelRef.current = true;

      setItems(defaultItems);
    } else if (query && cancelRef.current) {
      cancelRef.current = false;
    }
  }, [defaultItems, props.defaultValue, props.value, query]);

  const _items =
    items?.length === 0 && query === "" && defaultItems?.length
      ? defaultItems
      : items;

  const labelRef = React.useRef("");
  const currentLabel = _items?.find((item) => item.value === value)?.label;

  return (
    <>
      <Input
        {...props}
        type="hidden"
        value={_items?.find((item) => item.value === value)?.value}
        className="col-span-3"
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between col-span-3 flex w-full"
          >
            {labelRef.current
              ? labelRef.current
              : currentLabel || "Select color..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="left-28 w-[550px] p-0">
          <CommandBar
            onAddNew={() => onAddNew({ value: query })}
            key={`items-length:${items?.length}-query-${query}`}
            items={_items}
            value={value ?? ""}
            onValueChange={setQuery}
            query={query}
            onSelect={(currentValue) => {
              setValue(currentValue);
              setOpen(false);
              labelRef.current =
                _items?.find((item) => item.value === currentValue)?.label ??
                "";
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  );
}

const CommandBar = ({
  onValueChange,
  query,
  items,
  value,
  onSelect,
  onAddNew,
}: {
  onValueChange: (value: string) => void;
  query: string;
  items?: ComboboxItemProps[];
  value: number;
  onSelect: (value: number) => void;
  onAddNew: () => void;
}) => {
  return (
    <Command>
      <CommandInput
        key={`items-length:${items?.length}-query-${query}`}
        autoFocus
        value={query}
        placeholder="Search Item..."
        className="h-9"
        onValueChange={onValueChange}
      />

      {items?.length === 0 ? (
        <button
          onClick={onAddNew}
          className="px-3 py-2 flex flex-row space-x-2 items-center text-muted-foreground cursor-pointer"
        >
          <PlusCircledIcon className="h-4 w-4" />
          <div>Add new</div>
        </button>
      ) : null}

      {items?.length ? (
        <CommandGroup>
          {items?.map((item) => {
            return (
              <CommandItem
                key={item.value}
                onSelect={(item) => {
                  onSelect(+item.split("||")[0]);
                }}
              >
                <span className="hidden">{item.value}||</span>
                <span>{item.label}</span>
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            );
          })}
        </CommandGroup>
      ) : null}
    </Command>
  );
};
