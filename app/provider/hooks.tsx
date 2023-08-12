import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IDataValue, ViewName } from "../admin-utils/base-types";
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

export const useAdmin = () => {
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

  const form = SomeMachineContext.useSelector((state) => state.context.form);

  const routing = useRouting();

  const { handleSearchChange } = useAdminSearch();

  const emiiter = useUiEvents();

  return {
    state,
    send,
    data,
    control,
    form,
    columns,
    handleSearchChange,
    navigation,
    routing,
    emiiter,
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

const useEvents = () => {
  const [state, send] = SomeMachineContext.useActor();

  const crudCreate = state.matches("ready.crud.create");
  React.useEffect(() => {}, []);
};

const useUiEvents = () => {
  const [_, send] = SomeMachineContext.useActor();

  const clickCreate = () => {
    send("CRUD_CREATE");
  };

  const clickEdit = (row: IDataValue) => {
    send({
      type: "CRUD_EDIT",
      data: {
        row,
      },
    });
  };

  const clickCancel = () => {
    send({ type: "CRUD_CANCEL" });
  };

  return {
    clickCreate,
    clickEdit,
    clickCancel,
  };
};
