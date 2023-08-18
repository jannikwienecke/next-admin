import { LL } from "@/lib/utils";
import { actions, assign, createMachine } from "xstate";
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
import { title } from "process";

export const adminMachine = createMachine(
  {
    predictableActionArguments: true,
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

      UPDATE_DATA: {
        actions: ["updateData"],
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
                  CRUD_CLICK_CREATE_RELATIONAL_VALUE: {
                    target:
                      "#admin-machine.ready.showForm.editing.showRelationalForm",
                    actions: ["crudCreateRelational"],
                  },
                },
                states: {
                  showRelationalForm: {
                    on: {
                      CRUD_CANCEL: {
                        target: "#admin-machine.ready.showForm.editing",
                        actions: ["resetToOriginForm"],
                      },
                    },
                  },
                },
              },
              saving: {
                invoke: {
                  id: "invoke-action",
                  src: async (context, event, x) => {
                    LL("invoke-action", { context, event, x });

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
                      viewName:
                        context.form?.activeRelationalConfigs?.[0]?.name ||
                        context.config.name,
                    });
                  },
                  onDone: [
                    {
                      cond: (c) =>
                        c.form?.activeRelationalConfigs?.length === 1,
                      target: "#admin-machine.ready.showForm.editing",
                      actions: ["resetToOriginForm"],
                    },
                    {
                      target: "#admin-machine.ready",
                    },
                  ],
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
          baseColumns: modelSchema[activeClient.model]?.columns,
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
            filters: event.data.filters,
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

      updateData: assign((context, event) => {
        return {
          ...context,
          internal: {
            ...context.internal,
            data: event.data.data,
          },
          data: event.data.data,
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

      crudCreateRelational: assign((context, event) => {
        const config = Object.values(context.internal.config).find(
          (c) => c.model.toLowerCase() === event.data.modelName.toLowerCase()
        );

        if (!config) {
          return {
            ...context,
            form: {
              ...context.form,
              error: {
                message: `No Config was found for the model: "${event.data.modelName}"`,
              },
            },
          };
        }

        const acitveConfigsForModel =
          context.form?.activeRelationalConfigs || [];
        acitveConfigsForModel.push(config);

        return {
          ...context,
          form: {
            ...context.form,
            title: "Create row Relationa",
            activeRelationalConfigs: acitveConfigsForModel,
            state: event.data.formState,
            fields: generateFormFields({
              modelSchema: context.internal.modelSchema,
              activeRecord: undefined,
              config,
              defaultValueLabelKey: event.data.value,
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
            // state: event.data.formState,
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

      resetToOriginForm: assign((c) => {
        return {
          ...c,
          form: {
            ...c.form,
            activeRelationalConfigs: undefined,
            fields: generateFormFields({
              modelSchema: c.internal.modelSchema,
              // activeRecord: undefined,
              config: c.config,
              defaultFormState: c.form?.state,
            }),
          },
        };
      }),
    },
  }
);
