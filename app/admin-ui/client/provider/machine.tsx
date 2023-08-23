import { LL } from "@/lib/utils";
import { assign, createMachine } from "xstate";
import { serverAction } from "../../server/actions";
import {
  ConfigTypeDictClient,
  ICommand,
  IDataValue,
} from "../admin-utils/base-types";
import {
  generateColumns,
  generateCommandSearchView,
  generateCommandbarActions,
  generateFields,
  generateNavigationCategories,
  getLabelValue,
  getMetaData,
} from "../admin-utils/utils";
import { AdminStateEvents } from "./events";
import {
  AdminStateContextType,
  DEFAULT_ADMIN_STATE_CONTEXT,
} from "./state-context";
import { getPrismaModelSchema } from "../../server/utils";

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
          CLICK_OPEN_COMMAND_BAR: {
            target: "ready.showCommandbar",
            actions: ["openCommandbar"],
          },
          CLICK_ON_RELATIONAL_FIELD: {
            target: "#admin-machine.ready.showCommandbar.detail",
            actions: ["openCommandbarRelationalField"],
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

          showCommandbar: {
            initial: "commands",
            on: {
              CLICK_OPEN_COMMAND_BAR: {
                actions: ["showCommands"],
              },
              CLICK_CLOSE_COMMANDS: {
                actions: ["hideCommands"],
              },
            },
            states: {
              commands: {
                on: {
                  COMMAND_BAR_ACTION_FIRED: {
                    actions: ["commandBarActionFired"],
                    target: "search",
                  },
                  CLICK_CLOSE_COMMAND_BAR: {
                    target: "#admin-machine.ready",
                  },
                },
              },

              detail: {
                on: {
                  CLICK_CLOSE_COMMAND_BAR: {
                    target: "#admin-machine.ready.showCommandbar.commands",
                  },
                },
              },
              search: {
                on: {
                  CLICK_CLOSE_COMMAND_BAR: {
                    target: "#admin-machine.ready.showCommandbar.commands",
                  },
                  COMMAND_BAR_SELECT_ROW: {
                    target:
                      "#admin-machine.ready.showCommandbar.search.getSingleRecord",
                  },
                },

                initial: "searching",
                states: {
                  searching: {},
                  detail: {
                    on: {
                      CLICK_CLOSE_COMMAND_BAR: {
                        target: "#admin-machine.ready.showCommandbar.search",
                      },
                    },
                  },
                  getSingleRecord: {
                    invoke: {
                      id: "invoke-get-single-record",
                      src: async (context, event) => {
                        LL("invoke-action GET_SINGLE_RECORD", {
                          context,
                          event,
                        });

                        if (!context.state.commandbar.activeConfig) {
                          throw new Error("No activeConfig");
                        }

                        return (await serverAction({
                          action: {
                            data: (event as any).data.row,
                            name: "getSingleRecord",
                          },
                          viewName: context.state.commandbar.activeConfig.name,
                        })) as any;
                      },
                      onDone: {
                        target:
                          "#admin-machine.ready.showCommandbar.search.detail",
                        actions: ["openCommandbarDetailFromSearch"],
                      },
                      onError: {
                        actions: ["crudReadError"],
                      },
                    },
                  },
                },
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
                  src: async (context, event) => {
                    LL("invoke-action", { context, event });

                    const viewName =
                      context.form?.activeRelationalConfigs?.[0]?.name ||
                      context.config.name;

                    if (!context.state.activeAction)
                      throw new Error("No action");

                    const res = await serverAction({
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
                      viewName,
                    });
                    return {
                      data: res,
                      event,
                    };
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
          onClickRelationalField: (props) => {
            var evt = new CustomEvent("MyEventType", { detail: props });
            window.dispatchEvent(evt);
          },
        });

        const fields = generateFields({
          modelSchema,
          config: activeClient,
        });

        return {
          ...context,
          internal: {
            config: event.data.config,
            data: event.data.data,
            modelSchema,
            router: event.data.router,
            clientConfigServer: event.data.serverConfig,
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
            fields: generateFields({
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
            fields: generateFields({
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
            fields: generateFields({
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

      openCommandbarRelationalField: assign((c, event) => {
        if (!c.state?.commandbar.activeConfig?.name) {
          throw new Error("No activeConfig");
        }

        return {
          ...c,
          commandbar: {
            ...c.commandbar,
            view: {
              detail: {
                type: "detail" as const,
                view: event.data.name,
                activeItem: event.data.row,
                meta: getMetaData({
                  config: c.internal.clientConfigServer,
                  activeRecord: event.data.row,
                }),
                label: getLabelValue({
                  config: c.state?.commandbar.activeConfig,
                  activeRecord: event.data.row,
                }),
                fields: generateFields({
                  modelSchema: c.internal.modelSchema,
                  activeRecord: event.data.row,
                  config: c.state?.commandbar.activeConfig,
                }),
              },
            },
          },
        };
      }),

      openCommandbarDetailFromSearch: assign((c, event) => {
        if (!c.state?.commandbar.activeConfig?.name) {
          throw new Error("No activeConfig");
        }

        return {
          ...c,
          commandbar: {
            ...c.commandbar,
            view: {
              ...c.commandbar.view,
              detail: {
                label: getLabelValue({
                  config: c.state?.commandbar.activeConfig,
                  activeRecord: event.data as IDataValue,
                }),
                meta: getMetaData({
                  config: c.internal.clientConfigServer,
                  activeRecord: event.data as IDataValue,
                }),
                type: "detail" as const,
                view: c.state?.commandbar.activeConfig?.name,
                activeItem: event.data as IDataValue,
                fields: generateFields({
                  modelSchema: c.internal.modelSchema,
                  activeRecord: event.data as IDataValue,
                  config: c.state?.commandbar.activeConfig,
                }),
              },
            },
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

      crudReadError: assign((context, event) => {
        const message = (event.data as any)?.message || "Unknown error";

        return {
          ...context,
          state: {
            ...context.state,
            commandbar: {
              ...context.state.commandbar,
              error: {
                message,
              },
              //
            },
          },
        };
      }),

      resetToOriginForm: assign((c, e) => {
        const active = c.form?.activeRelationalConfigs;

        const { id, ...rest } = (e as any)?.data?.data;

        const fieldName = active?.[0].name as string;
        const labelKey = active?.[0].labelKey as string;
        const labelValue = rest[labelKey] || id;

        const fieldNameFirstLetterUppercase =
          fieldName[0].toUpperCase() + fieldName.slice(1);

        // form state gets reset to origin - other relational field are not set
        console.log(c.form?.state);

        return {
          ...c,
          form: {
            ...c.form,
            activeRelationalConfigs: undefined,
            fields: generateFields({
              modelSchema: c.internal.modelSchema,
              activeRecord: undefined,
              config: c.config,
              defaultFormState: {
                ...c.form?.state,
                [fieldNameFirstLetterUppercase]: {
                  value: id,
                  label: labelValue,
                },
              },
            }),
          },
        };
      }),

      showCommands: assign((c) => {
        return {
          ...c,
          state: {
            ...c.state,
            commandbar: {
              ...c.state.commandbar,
              showCommands: true,
            },
          },
        };
      }),

      hideCommands: assign((c) => {
        return {
          ...c,
          state: {
            ...c.state,
            commandbar: {
              ...c.state.commandbar,
              showCommands: false,
            },
          },
        };
      }),

      // commandbar
      openCommandbar: assign((c) => {
        return {
          ...c,
          commandbar: {
            ...c.commandbar,
            view: {
              commands: generateCommandbarActions({
                config: c.internal.config,
              }),
            },
          },
        };
      }),
      commandBarActionFired: assign((c, event) => {
        const action = event.data.action;

        const isNavigation = action.action.type === "NAVIGATION";

        if (!isNavigation) {
          throw new Error(`Action type not supported: ${action.action.type}`);
        }

        if ("to" in action.action === false) {
          throw new Error(`Action type not supported: ${action.action.type}`);
        }

        const searchView = action.action.to.view;
        return {
          ...c,
          state: {
            ...c.state,
            commandbar: {
              ...c.commandbar,
              showCommands: false,
              activeConfig:
                c.internal.config[searchView as keyof ConfigTypeDictClient],
            },
          },
          commandbar: {
            ...c.commandbar,
            view: {
              ...c.commandbar.view,
              search: generateCommandSearchView({
                config: c.internal.config,
                viewName: searchView,
                // x : event.data.action.action.
              }),
            },
          },
        };
      }),
    },
  }
);
