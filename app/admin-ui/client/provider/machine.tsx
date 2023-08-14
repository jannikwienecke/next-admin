import { LL } from "@/lib/utils";
import { assign, createMachine } from "xstate";
import { serverAction } from "../../server/actions";
import {
  generateColumns,
  generateFormFields,
  generateNavigationCategories,
} from "../admin-utils/utils";
import { AdminStateEvents } from "./events";
import {
  AdminStateContextType,
  DEFAULT_ADMIN_STATE_CONTEXT,
} from "./state-context";

export const adminMachine = createMachine(
  {
    tsTypes: {} as import("./machine.typegen").Typegen0,
    schema: {
      context: {} as AdminStateContextType,
      events: {} as AdminStateEvents,
    },

    id: "admin-machine",
    initial: "idle",
    context: DEFAULT_ADMIN_STATE_CONTEXT,
    on: {
      INIT_STATE: {
        target: "ready",
        actions: ["init"],
      },
    },
    states: {
      idle: {},

      ready: {
        on: {
          // CRUD
          CRUD_CREATE: {
            target: "ready.showForm",
            actions: ["crudCreate"],
          },
          CRUD_EDIT: {
            target: "ready.showForm",
            actions: ["crudEdit"],
          },
          CRUD_DELETE: {
            target: "ready.deleting",
            actions: ["crudDelete"],
          },
        },
        initial: "waiting",

        states: {
          waiting: {},
          deleting: {
            invoke: {
              id: "invoke-delete-action",
              src: async (context, event) => {
                LL("invoke-action DELETE", { context, event });
                await serverAction({
                  action: {
                    data: (event as any).data.row,
                    name: "delete",
                  },
                  viewName: context.config.name,
                });
              },
              onDone: {
                target: "#admin-machine.ready",
              },
              onError: {
                actions: ["crudSaveError"],
              },
            },
          },
          showForm: {
            initial: "editing",
            states: {
              editing: {
                on: {
                  CRUD_CANCEL: {
                    target: "#admin-machine.ready.waiting",
                  },
                  CRUD_SAVE: {
                    target: "#admin-machine.ready.showForm.saving",
                    actions: ["crudSave"],
                  },
                },
              },
              saving: {
                invoke: {
                  id: "invoke-action",
                  src: async (context, event) => {
                    LL("invoke-action", { context, event });

                    if (!context.state.activeAction)
                      throw new Error("No action");

                    await serverAction({
                      action: {
                        data: {
                          ...(event as any).data.formState,
                          id:
                            context.state.activeAction === "create"
                              ? null
                              : context.state.activeRow?.id,
                        },
                        name: context.state.activeAction,
                      },
                      viewName: context.config.name,
                    });
                  },
                  onDone: {
                    target: "#admin-machine.ready",
                  },
                  onError: {
                    target: "editing",
                    actions: ["crudSaveError"],
                  },
                },
              },
            },
          },

          searching: {},
          loading: {
            //
          },
        },
      },
    },
  },
  {
    actions: {
      init: assign((context, event) => {
        const { config, modelSchema, view, query } = event.data;

        const activeClient = Object.values(config).find(
          (config) => config.name.toLowerCase() === view.toLowerCase()
        );

        if (!activeClient) {
          throw new Error(`No client found for view: ${view}`);
        }

        const columnsToRender = generateColumns({
          customColumns: activeClient.table.columns,
          baseColumns: modelSchema.columns,
          columnsToHide: (activeClient.table.columnsToHide || []) as string[],
        });

        const fields = generateFormFields({
          modelSchema,
          config: activeClient,
        });

        return {
          ...context,
          internal: {
            config: event.data.config,
            data: event.data.data,
            modelSchema,
          },
          config: activeClient,
          data: event.data.data,
          columns: columnsToRender,
          navigation: {
            categories: generateNavigationCategories({
              config: config,
            }),
            // categories: config.
          },
          control: {
            ...context.control,
            search: {
              ...context.control.search,
              value: query,
            },
          },
          form: {
            ...context.form,
            title: "",
            description: "",
            fields,
          },
        };
      }),

      // CRUD
      crudEdit: assign((context, event) => {
        return {
          ...context,
          form: {
            ...context.form,
            title: "Edit row",
            fields: generateFormFields({
              // modelSchema: context.internal.,
              modelSchema: context.internal.modelSchema,
              activeRecord: event.data.row,
              config: context.config,
            }),
          },
          state: {
            ...context.state,
            activeRow: event.data.row,
            activeAction: "edit" as const,
          },
        };
      }),

      crudCreate: assign((context, event) => {
        return {
          ...context,
          form: {
            ...context.form,
            title: "Create row",
            fields: generateFormFields({
              // modelSchema: context.internal.,
              modelSchema: context.internal.modelSchema,
              activeRecord: undefined,
              config: context.config,
            }),
          },
          state: {
            ...context.state,
            activeRow: undefined,
            activeAction: "create" as const,
          },
        };
      }),

      crudDelete: assign((context, event) => {
        const row = event.data.row;

        return {
          ...context,
          data: context.data.filter((r) => r.id !== row.id),
        };
      }),

      crudSave: assign((context, event) => {
        return {
          ...context,
          form: {
            ...context.form,
            title: context.form?.title || "",
            fields: context.form?.fields || [],
            state: event.data.formState,
            error: undefined,
          },
        };
      }),

      crudSaveError: assign((context, event) => {
        const message = (event.data as any)?.message || "Unknown error";
        return {
          ...context,
          form: {
            ...context.form,
            title: context.form?.title || "",
            fields: context.form?.fields || [],
            error: {
              message,
            },
          },
        };
      }),
    },
  }
);
