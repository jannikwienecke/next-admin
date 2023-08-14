import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IDataValue, ViewName } from "../admin-utils/base-types";
import { Routing } from "../admin-utils/routing";
import { SomeMachineContext } from "./state";
import { serverAction } from "../api/actions";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { LL } from "@/lib/utils";

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

const useEvents = () => {
  const [state, send] = SomeMachineContext.useActor();

  const crudCreate = state.matches("ready.crud.create");
  React.useEffect(() => {}, []);
};

const useUiEvents = () => {
  const [state, send] = SomeMachineContext.useActor();
  const fields = state.context.form?.fields || [];
  const form = state.context.form;

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

  return {
    clickCreate,
    clickEdit,
    clickCancel,
    clickSave,
    clickDelete,
  };
};

// export const useServerActions = () => {
//   const [state, send] = SomeMachineContext.useActor();

//   const saving = state.matches("ready.showForm.saving");
//   const contextState = state.context.state;

//   React.useEffect(() => {
//     // console.log("====", state.historyValue?.states.ready?.states.showForm);
//   }, [state.historyValue]);

//   // const isSavingRef = React.useRef(false);
//   // React.useEffect(() => {
//   //   if (!saving) return;
//   //   if (isSavingRef.current) return;

//   //   isSavingRef.current = true;

//   //   const runAction = async () => {
//   //     try {
//   //       await serverAction({
//   //         action: {
//   //           data: {},
//   //           name: "create",
//   //         },
//   //         viewName: state.context.config.name,
//   //       });
//   //     } catch (error) {
//   //       console.log("ERROR");
//   //     } finally {
//   //       isSavingRef.current = false;
//   //     }
//   //   };
//   //   runAction();
//   // }, [contextState, saving, state.context.config.name]);
// };

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
  const [state, send] = SomeMachineContext.useActor();

  const f = state.context.form;
  const fields = f?.fields || [];

  const form = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: fields?.reduce((acc, field) => {
      acc[field.name] = field.defaultValue;
      return acc;
    }, {} as any),
  });

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

  return {
    form,
    fields,
    submitForm,
  };
};
