import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Router } from "next/router";
import React from "react";
import {
  FormFieldType,
  ICommand,
  IDataValue,
  RelationalFieldClickHandlerProps,
  SortingProps,
} from "../admin-utils/base-types";
import { Routing } from "../admin-utils/routing";
import { SomeMachineContext } from "./state";
import { getActiveConfig } from "../admin-utils/utils";

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

  const commandbar = SomeMachineContext.useSelector(
    (state) => state.context.commandbar
  );

  const routing = useRouting();

  const { handleSearchChange, query } = useAdminSearch();

  useNotifications();

  useInternalEvents();

  useCommandbar();

  const emiiter = useUiEvents();

  const formHandler = useAdminForm({
    onSubmit: emiiter.clickSave,
  });

  const activeConfig = getActiveConfig({ context: state.context });
  const activeFormState =
    form.stateOfForms?.[activeConfig?.name as keyof typeof form.stateOfForms];

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
    commandbar,
    activeConfig,
    activeFormState,
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

  const isCancellingRef = React.useRef(false);
  React.useEffect(() => {
    if (state.event.type === "CRUD_CANCEL") {
      isCancellingRef.current = false;
    }
  }, [state.event.type]);

  const clickCancel = () => {
    if (isCancellingRef.current) return;
    isCancellingRef.current = true;

    setTimeout(() => {
      isCancellingRef.current = false;
    }, 100);

    send({ type: "CRUD_CANCEL" });
  };

  const clickSave = () => {
    send({ type: "CRUD_SAVE" });
  };

  const clickSaveOnDisabeld = () => {
    send({ type: "CRUD_SAVE_ON_DISABLED" });
  };

  const clickDelete = (row: IDataValue) => {
    send({ type: "CRUD_DELETE", data: { row } });
  };

  const clickCreateRelationalValue = (props: {
    modelName: string;
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

  const clickCloseCommandbar = () => {
    send({ type: "CLICK_CLOSE_COMMAND_BAR" });
  };

  const clickCommandbarAction = (action: ICommand) => {
    send({
      type: "COMMAND_BAR_ACTION_FIRED",
      data: { action },
    });
  };

  const selectRowInCommandbar = ({ row }: { row: { id: number } }) => {
    send({
      type: "COMMAND_BAR_SELECT_ROW",
      data: { row },
    });
  };

  const clickCommandsClose = () => {
    send("CLICK_CLOSE_COMMANDS");
  };

  const changeFormState = (props: { field: FormFieldType; value: any }) => {
    send({
      type: "FORM_CHANGE",
      data: props,
    });
  };

  return {
    clickCreate,
    clickEdit,
    clickCancel,
    clickSave,
    clickSaveOnDisabeld,
    clickDelete,
    clickCreateRelationalValue,
    clickSorting,
    clickCloseCommandbar,
    clickCommandbarAction,
    clickCommandsClose,
    selectRowInCommandbar,
    changeFormState,
  };
};

const useNotifications = () => {
  const [state, send] = SomeMachineContext.useActor();

  const { toast } = useToast();
  const form = state.context.form;
  const commandbar = state.context.state.commandbar;

  const error = form?.error || commandbar?.error;

  React.useEffect(() => {
    if (!error?.message) return;

    toast({
      title: "Something went wrong",
      description: error?.message,
      // action: <ToastAction altText={"try again"}>Try again</ToastAction>,
      variant: "destructive",
    });
  }, [error?.message, toast]);
};

export const useAdminForm = ({
  onSubmit,
}: {
  onSubmit: (data: Record<string, string>) => void;
}) => {
  const [state, _] = SomeMachineContext.useActor();

  const f = state.context.form;
  const fields = React.useMemo(() => f?.fields || [], [f?.fields]);

  // const form = useForm({
  //   // resolver: zodResolver(formSchema),
  //   defaultValues: fields?.reduce((acc, field) => {
  //     acc[field.name] = field.defaultValue;
  //     return acc;
  //   }, {} as any),
  // });

  // React.useEffect(() => {
  //   form.reset({});
  // }, [form, state.context.form?.activeRelationalConfigs?.length]);

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = new FormData(event.target as HTMLFormElement);

    let missingValue = false;

    const values_ = fields.reduce((acc, field) => {
      const val = values.get(field.name);

      if (field.required && !val) {
        missingValue = true;

        // form.setError(field.name, {
        //   message: `Field "${field.label}" is required`,
        //   type: "required",
        // });
      }

      acc[field.name] = val;
      return acc;
    }, {} as any);

    if (missingValue) return;

    onSubmit(values_);
  };

  return {
    // form,
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

const useInternalEvents = () => {
  const [state, send] = SomeMachineContext.useActor();

  const clickRelationalFieldListener = React.useCallback(
    (event: CustomEvent<RelationalFieldClickHandlerProps>) => {
      send({
        type: "CLICK_ON_RELATIONAL_FIELD",
        data: {
          name: event.detail.name,
          row: event.detail.row,
        },
      });
    },
    [send]
  );

  React.useEffect(() => {
    window.removeEventListener(
      "CUSTOM_EVENT_ADMIN" as any,
      clickRelationalFieldListener
    );

    window.addEventListener(
      "CUSTOM_EVENT_ADMIN" as any,
      clickRelationalFieldListener,
      false
    );

    return () => {
      window.removeEventListener(
        "CUSTOM_EVENT_ADMIN" as any,
        clickRelationalFieldListener
      );
    };
  }, [clickRelationalFieldListener, send]);
};

export const useCommandbar = () => {
  const [state, send] = SomeMachineContext.useActor();

  const commandbarState = state.context.state.commandbar;

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        send({ type: "CLICK_OPEN_COMMAND_BAR" });
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (commandbarState.showCommands) {
          send({ type: "CLICK_CLOSE_COMMANDS" });
        } else {
          send({ type: "CLICK_CLOSE_COMMAND_BAR" });
          send("CRUD_CANCEL");
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();
        // send({ type: "CLICK_ENTER_KEY_COMMAND_BAR" });
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);

    // same for escape
  }, [commandbarState.showCommands, send]);
};

export const useAdminCommandState = ({
  commands,
}: {
  commands: ICommand[];
}) => {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const _filtered = [
      ...Array.from(new Set(commands.map((a) => a.label))),
    ].filter((a) => a.toLowerCase().includes(query.toLowerCase()));
    return _filtered;
  }, [commands, query]);

  const all = React.useMemo(() => {
    return commands;
  }, [commands]);

  const updateQuery = React.useCallback((query: string) => {
    setQuery(query);
  }, []);

  React.useEffect(() => {
    return () => {
      updateQuery("");
    };
  }, [updateQuery]);

  const getInputProps = React.useCallback(() => {
    return {
      value: query,
      onChangeCapture: (e: any) => updateQuery(e.target.value),
      autoFocus: true,
      placeholder: "Type a command or search...",
    };
  }, [query, updateQuery]);

  const getEmptyProps = React.useCallback(() => {
    return {
      query,
      show: filtered.length === 0,
    };
  }, [filtered.length, query]);

  const showFilterd = filtered.length > 0 && query.length > 0;
  return {
    query,
    filtered,
    all,
    updateQuery,
    getInputProps,
    getEmptyProps,
    showFilterd,
  };
};
