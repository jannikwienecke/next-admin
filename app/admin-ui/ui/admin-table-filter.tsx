import { Column } from "@tanstack/react-table";
import * as React from "react";

import { Filter } from "@/components/container/filter";
import { FilterOptionType } from "../client/admin-utils/base-types";

export interface AdminTableFilter<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: FilterOptionType[];
}

export function AdminTableFilter<TData, TValue>({
  column,
  title,
  options,
}: AdminTableFilter<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const handleSelect = (optionValue: string, isSelected: boolean) => {
    if (isSelected) {
      selectedValues.delete(optionValue);
    } else {
      selectedValues.add(optionValue);
    }
    const filterValues = Array.from(selectedValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
  };

  return (
    <Filter
      facets={facets}
      onReset={() => column?.setFilterValue(undefined)}
      options={options.map((option) => {
        return {
          ...option,
          onSelect: (isSelected) => handleSelect(option.value, isSelected),
        };
      })}
      selectedValues={selectedValues}
      title={title}
    />
  );
}
