import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IDataValue, SortingProps } from "../admin-utils/base-types";
import { Routing } from "../admin-utils/routing";
import { SomeMachineContext } from "./state";
import { serverAction } from "../../server/actions";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { LL } from "@/lib/utils";
import { Router } from "next/router";

const useRouting = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = React.useState(false);

  const routing = React.useMemo(() => {
    return Routing.create(searchParams);
  }, [searchParams]);

  const routingRef = React.useRef(routing);

  React.useEffect(() => {
    routingRef.current = routing;
  }, [routing]);

  const view = React.useMemo(() => {
    return routingRef.current.getCurrentView();
  }, []);

  const query = React.useMemo(() => {
    return routingRef.current.getQuery();
  }, []);

  const sorting = React.useMemo(() => {
    return routingRef.current.getSorting();
  }, []);

  const _update = React.useCallback(
    (routing: Routing) => {
      router.push(`?${routing.toString()}`);
      setLoading(true);
    },
    [router]
  );

  const redirectToView = React.useCallback(
    (view: string) => {
      routing.updateSorting(null);

      _update(routingRef.current.redirectToView(view));
    },
    [_update, routing]
  );

  const updateQuery = React.useCallback(
    (query: string) => {
      _update(routingRef.current.updateQuery(query));
    },
    [_update]
  );

  const updateSorting = React.useCallback(
    (sorting: SortingProps) => {
      _update(routingRef.current.updateSorting(sorting));
    },
    [_update]
  );

  const endLoading = React.useCallback(() => {
    setLoading(false);
  }, []);

  return {
    view: routingRef.current.getCurrentView(),
    query,
    redirectToView,
    updateQuery,
    updateSorting,
    sorting,
    loading,
    endLoading,
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

  const { handleSearchChange, query } = useAdminSearch();

  useNotifications();

  const emiiter = useUiEvents();

  const formHandler = useAdminForm({
    onSubmit: emiiter.clickSave,
  });

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
    formHandler,
    emiiter,
    query,
  };
};

const useAdminSearch = () => {
  const { updateQuery, query: urlQuery } = useRouting();

  const [query, setQuery] = React.useState(urlQuery);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);

    debouncedSearch(() => {
      updateQueryString(value);
    });
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
    query,
  };
};

const useUiEvents = () => {
  const [state, send] = SomeMachineContext.useActor();
  const fields = state.context.form?.fields || [];
  const form = state.context.form;

  const { updateQuery, query: urlQuery, updateSorting } = useRouting();

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

  const clickSave = (formState: Record<string, string>) => {
    send({ type: "CRUD_SAVE", data: { formState } });
  };

  const clickDelete = (row: IDataValue) => {
    send({ type: "CRUD_DELETE", data: { row } });
  };

  const clickCreateRelationalValue = (props: {
    modelName: string;
    formState: Record<string, any>;
    value: string;
  }) => {
    send({
      type: "CRUD_CLICK_CREATE_RELATIONAL_VALUE",
      data: props,
    });
  };

  const clickSorting = (sorting: SortingProps) => {
    updateSorting(sorting);
  };

  return {
    clickCreate,
    clickEdit,
    clickCancel,
    clickSave,
    clickDelete,
    clickCreateRelationalValue,
    clickSorting,
  };
};

const useNotifications = () => {
  const [state, send] = SomeMachineContext.useActor();

  const { toast } = useToast();
  const form = state.context.form;

  React.useEffect(() => {
    const error = form?.error;
    if (!error?.message) return;

    toast({
      title: "Something went wrong",
      description: error?.message,
      // action: <ToastAction altText={"try again"}>Try again</ToastAction>,
      variant: "destructive",
    });
  }, [form?.error, toast]);
};

export const useAdminForm = ({
  onSubmit,
}: {
  onSubmit: (data: Record<string, string>) => void;
}) => {
  const [state, _] = SomeMachineContext.useActor();

  const f = state.context.form;
  const fields = React.useMemo(() => f?.fields || [], [f?.fields]);

  const form = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: fields?.reduce((acc, field) => {
      acc[field.name] = field.defaultValue;
      return acc;
    }, {} as any),
  });

  React.useEffect(() => {
    form.reset({});
  }, [form, state.context.form?.activeRelationalConfigs?.length]);

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = new FormData(event.target as HTMLFormElement);

    let missingValue = false;

    const values_ = fields.reduce((acc, field) => {
      const val = values.get(field.name);

      if (field.required && !val) {
        missingValue = true;
        form.setError(field.name, {
          message: `Field "${field.label}" is required`,
          type: "required",
        });
      }

      acc[field.name] = val;
      return acc;
    }, {} as any);

    if (missingValue) return;

    onSubmit(values_);
  };

  React.useEffect(() => {
    // after fields change -> reset the form with the new default values
    fields.forEach((f) => {
      if (!f.defaultValue) return;
      form.setValue(f.name, f.defaultValue);
    });
  }, [fields, form]);

  return {
    form,
    fields,
    submitForm,
  };
};

export const useRouterLoading = () => {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);
  return loading;
};
