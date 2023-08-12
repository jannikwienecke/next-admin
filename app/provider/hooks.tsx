import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { ViewName } from "../admin-utils/base-types";
import { Routing } from "../admin-utils/routing";
import { SomeMachineContext } from "./state";

const useRouting = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const routing = React.useMemo(() => {
    return Routing.create(searchParams);
  }, [searchParams]);

  const view = React.useMemo(() => {
    return routing.getCurrentView();
  }, [routing]);

  const query = React.useMemo(() => {
    return routing.getQuery();
  }, [routing]);

  const _update = React.useCallback(
    (routing: Routing) => {
      router.push(`?${routing.toString()}`);
    },
    [router]
  );

  const redirectToView = React.useCallback(
    (view: ViewName) => {
      _update(routing.redirectToView(view));
    },
    [_update, routing]
  );

  const updateQuery = React.useCallback(
    (query: string) => {
      _update(routing.updateQuery(query));
    },
    [_update, routing]
  );

  return {
    view,
    query,
    redirectToView,
    updateQuery,
  };
};

export const useMachine = () => {
  const [state, send] = SomeMachineContext.useActor();
  const data = SomeMachineContext.useSelector((state) => state.context.data);
  const columns = SomeMachineContext.useSelector(
    (state) => state.context.columns
  );
  const control = SomeMachineContext.useSelector(
    (state) => state.context.control
  );

  const navigation = SomeMachineContext.useSelector(
    (state) => state.context.navigation
  );

  const routing = useRouting();

  const { handleSearchChange } = useAdminSearch();

  return {
    state,
    send,
    data,
    control,
    columns,
    handleSearchChange,
    navigation,
    routing,
  };
};

const useAdminSearch = () => {
  const [_, send] = SomeMachineContext.useActor();

  const { updateQuery } = useRouting();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    send({
      type: "SEARCH_CHANGED",
      data: {
        value: value,
      },
    });

    debouncedSearch(() => updateQueryString(value));
  };

  const updateQueryString = React.useCallback(
    (query: string) => {
      // router.push(pathname + "?" + createQueryString("query", query));
      updateQuery(query);
    },
    [updateQuery]
  );

  const timeoutRef = React.useRef<any>();
  const debouncedSearch = React.useCallback((callback: () => void) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      callback();
    }, 500);

    return () => clearTimeout(timeoutRef.current);
  }, []);

  return {
    handleSearchChange,
  };
};
