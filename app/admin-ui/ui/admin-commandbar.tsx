import { CommandDialog } from "@/components/ui/command";
import { useAdminState } from "../client/provider/state";
import { CommandsView } from "./admin-commandbar-commands";
import { DetailView } from "./admin-commandbar-detail";
import { SearchView } from "./admin-commandbar-search";

export function AdminCommandbar() {
  const { commandbar, state, emiiter } = useAdminState();

  const isSearchView = state.matches("ready.showCommandbar.search");
  const isOpen = state.matches("ready.showCommandbar");

  const isDetailView =
    state.matches("ready.showCommandbar.detail") ||
    state.matches("ready.showCommandbar.search.detail");

  return (
    <>
      <CommandDialog
        open={isOpen}
        onOpenChange={(open) => {
          !open && emiiter.clickCloseCommandbar();
        }}
      >
        <div data-cy="admin-commandbar">
          {isDetailView && commandbar.view?.detail?.activeItem ? (
            <DetailView />
          ) : isSearchView ? (
            <SearchView />
          ) : (
            <CommandsView />
          )}
        </div>
      </CommandDialog>
    </>
  );
}
