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
import { LL, cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useDebounce } from "@uidotdev/usehooks";
import * as React from "react";
import { FormFieldType } from "../admin-utils/base-types";

interface ComboboxItemProps {
  value: string;
  label: string;
}

export const RelationFormInputField = ({ ...props }: FormFieldType) => {
  return <AdminRelationCombobox {...props} />;
};

function AdminRelationCombobox({ relation, ...props }: FormFieldType) {
  const [open, setOpen] = React.useState(false);

  const defaultValue: ComboboxItemProps | undefined = (
    props.defaultValue as any
  )?.label
    ? (props.defaultValue as any)
    : undefined;

  LL({ defaultValue });

  const [value, setValue] = React.useState(defaultValue?.label);
  const [defaultItems, setDefaultItems] = React.useState<ComboboxItemProps[]>();
  const [items, setItems] = React.useState<ComboboxItemProps[]>();

  if (!relation) throw new Error("No relation");

  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);

  const cancelRef = React.useRef(false);
  React.useEffect(() => {
    const fetchData = async () => {
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

  const _items = items?.length === 0 ? defaultItems : items;

  return (
    <>
      <Input
        {...props}
        type="hidden"
        value={_items?.find((item) => item.label === value)?.value}
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
            {value ? value : "Select color..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] p-0">
          <CommandBar
            key={query ? query : _items?.length ? "items" : "no-items"}
            items={_items}
            value={value ?? ""}
            onValueChange={setQuery}
            query={query}
            onSelect={(currentValue) => {
              setValue(currentValue === value ? "" : currentValue);
              setOpen(false);
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
}: {
  onValueChange: (value: string) => void;
  query: string;
  items?: {
    value: string;
    label: string;
  }[];
  value: string;
  onSelect: (value: string) => void;
}) => {
  return (
    <Command>
      <CommandInput
        key={query ? query : items?.length ? "items" : "no-items"}
        autoFocus
        value={query}
        placeholder="Search Item..."
        className="h-9"
        onValueChange={onValueChange}
      />

      <CommandEmpty>Noting found.</CommandEmpty>

      <CommandGroup>
        {items?.map((item) => (
          <CommandItem value={item.value} key={item.value} onSelect={onSelect}>
            {item.label}
            <CheckIcon
              className={cn(
                "ml-auto h-4 w-4",
                value === item.value ? "opacity-100" : "opacity-0"
              )}
            />
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
};
