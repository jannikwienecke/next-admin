import React from "react";
import { useAdminState } from "../client/provider/state";
import { useDebounce } from "@uidotdev/usehooks";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Spinner } from "@/components/ui/spinner";
import { ComboboxItemProps } from "../client/admin-utils/base-types";
import { CommandDialogFooter } from "./admin-commandbar-footer";
import { AdminCommandbarEmpty } from "./admin-commandbar-empty";
import { AdminCommandbarSpinner } from "./admin-commandbar-spinner";

export const SearchView = () => {
  const { state } = useAdminState();
  const commandbarState = state.context.state.commandbar;

  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<ComboboxItemProps[]>([]);
  const [isLoadingInit, setIsLoadingInit] = React.useState<boolean>();

  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `api?query=${debouncedQuery}&model=${commandbarState.activeConfig?.model}`
        );

        const data = (await res.json()) as ComboboxItemProps[];
        setResults(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingInit(false);
      }
    };

    fetchData();
  }, [commandbarState, debouncedQuery]);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoadingInit((prev) => (prev === undefined ? true : prev));
    }, 150);
  }, []);

  return (
    <Command key={`items-length:${results?.length}-query-${query}`}>
      <SearchViewContent
        {...{
          query,
          setQuery,
          results,
          isLoadingInit: isLoadingInit,
        }}
      />
    </Command>
  );
};

const SearchViewContent = ({
  query,
  setQuery,
  results,
  isLoadingInit,
}: {
  query: string;
  setQuery: (query: string) => void;
  results: ComboboxItemProps[];
  isLoadingInit?: boolean;
}) => {
  const { state, emiiter } = useAdminState();
  const commandbarState = state.context.state.commandbar;

  return (
    <>
      <CommandInput
        autoFocus={true}
        onChangeCapture={(e: any) => setQuery(e.target.value)}
        value={query}
        placeholder={`Search for ${commandbarState.activeConfig?.label}...`}
      />

      <CommandList className="h-[25rem]">
        {isLoadingInit === false && results.length === 0 ? (
          <AdminCommandbarEmpty query={query} />
        ) : null}

        {isLoadingInit ? <AdminCommandbarSpinner /> : null}

        <CommandGroup heading={`Results for "${query}"`}>
          {results.map((data) => (
            <CommandItem
              onSelect={() => {
                emiiter.selectRowInCommandbar({
                  row: { id: data.value },
                });
              }}
              key={data.value}
            >
              {commandbarState.activeConfig && (
                <commandbarState.activeConfig.navigation.icon className="mr-4 h-4 w-4" />
              )}

              <span>{data.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <CommandDialogFooter />
    </>
  );
};
